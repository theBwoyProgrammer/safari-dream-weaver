const API_BASES = {
  sandbox: "https://cybqa.pesapal.com/pesapalv3",
  production: "https://pay.pesapal.com/v3",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });

const apiBase = (env) => API_BASES[env.PESAPAL_ENV || "sandbox"] || API_BASES.sandbox;

const verifyFirebaseToken = async (request, env) => {
  const authorization = request.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) throw new Error("Sign in as an admin first.");
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: authorization.slice(7) }),
  });
  const data = await response.json();
  const user = data.users?.[0];
  if (!response.ok || !user) throw new Error("Invalid Firebase authentication.");
  const profileResponse = await fetch(
    `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(user.localId)}`,
    { headers: { Authorization: `Bearer ${authorization.slice(7)}` } },
  );
  const profile = await profileResponse.json();
  const role = profile.fields?.role?.stringValue;
  if (!profileResponse.ok || (role !== "admin" && role !== "super_admin")) throw new Error("Only lodge admins can create payment links.");
  return user;
};

const getPesapalToken = async (env) => {
  const response = await fetch(`${apiBase(env)}/Auth/RequestToken`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: env.PESAPAL_CONSUMER_KEY,
      consumer_secret: env.PESAPAL_CONSUMER_SECRET,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.token) throw new Error("Pesapal authentication failed.");
  return data.token;
};

const getTransactionStatus = async (env, trackingId) => {
  const token = await getPesapalToken(env);
  const response = await fetch(
    `${apiBase(env)}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(trackingId)}`,
    { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
  );
  const data = await response.json();
  if (!response.ok) throw new Error("Pesapal status lookup failed.");
  return data;
};

const statusName = (statusCode) => {
  const code = Number(statusCode);
  if (code === 1) return "COMPLETED";
  if (code === 2 || code === 3) return "FAILED";
  return "PENDING";
};

const redirectToResult = (env, status, trackingId, reference) => {
  const resultUrl = new URL("/payment-result", env.FRONTEND_URL);
  resultUrl.searchParams.set("status", status);
  if (trackingId) resultUrl.searchParams.set("OrderTrackingId", trackingId);
  if (reference) resultUrl.searchParams.set("OrderMerchantReference", reference);
  return Response.redirect(resultUrl.toString(), 302);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
      });
    }

    if (url.pathname === "/create-payment" && request.method === "POST") {
      try {
        await verifyFirebaseToken(request, env);
        const { bookingId, guestName, guestEmail, guestPhone, amount, description } = await request.json();
        if (!bookingId || !guestName || !guestEmail || !Number(amount) || Number(amount) <= 0) {
          return json({ error: "Booking, guest, email, and a positive amount are required." }, 400);
        }

        const token = await getPesapalToken(env);
        const orderResponse = await fetch(`${apiBase(env)}/api/Transactions/SubmitOrderRequest`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            id: bookingId,
            currency: "UGX",
            amount: Number(amount),
            description: description || "Tembo Safari Lodge reservation",
            callback_url: `${env.WORKER_URL}/callback`,
            notification_id: env.PESAPAL_IPN_ID,
            billing_address: {
              email_address: guestEmail,
              phone_number: guestPhone || "",
              first_name: guestName,
            },
          }),
        });
        const data = await orderResponse.json();
        if (!orderResponse.ok || !data.redirect_url) {
          console.error("Pesapal order creation failed", data);
          return json({ error: "Pesapal could not create the payment link." }, 502);
        }
        return json({
          redirect_url: data.redirect_url,
          order_tracking_id: data.order_tracking_id || "",
        });
      } catch (error) {
        console.error("Payment creation failed", error);
        return json({ error: error.message || "Could not create the Pesapal payment link." }, 500);
      }
    }

    if (url.pathname === "/callback" && request.method === "GET") {
      const trackingId = url.searchParams.get("OrderTrackingId");
      const reference = url.searchParams.get("OrderMerchantReference");
      if (!trackingId) return redirectToResult(env, "FAILED", "", reference);

      try {
        const data = await getTransactionStatus(env, trackingId);
        return redirectToResult(env, statusName(data.status_code), trackingId, reference);
      } catch (error) {
        console.error("Pesapal callback status lookup failed", error);
        return redirectToResult(env, "PENDING", trackingId, reference);
      }
    }

    if (url.pathname === "/status" && request.method === "GET") {
      const trackingId = url.searchParams.get("OrderTrackingId");
      if (!trackingId) return json({ error: "OrderTrackingId is required." }, 400);

      try {
        const data = await getTransactionStatus(env, trackingId);
        return json({ ...data, normalized_status: statusName(data.status_code) });
      } catch (error) {
        console.error("Pesapal status request failed", error);
        return json({ error: "Could not retrieve payment status." }, 502);
      }
    }

    if (url.pathname === "/ipn" && (request.method === "GET" || request.method === "POST")) {
      const trackingId = url.searchParams.get("OrderTrackingId");
      if (trackingId) {
        try {
          const data = await getTransactionStatus(env, trackingId);
          console.log("Pesapal IPN status", {
            trackingId,
            reference: url.searchParams.get("OrderMerchantReference"),
            status: statusName(data.status_code),
          });
        } catch (error) {
          console.error("Pesapal IPN status lookup failed", error);
        }
      }
      return json({ orderNotificationType: "IPNCHANGE" });
    }

    return json({ error: "Not found." }, 404);
  },
};
