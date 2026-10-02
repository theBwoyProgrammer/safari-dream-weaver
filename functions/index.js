const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const pesapayKey = defineSecret("PESAPAY_KEY");
const pesapaySecret = defineSecret("PESAPAY_SECRET");
const pesapayIpnId = defineSecret("PESAPAY_IPN_ID");
const pesapayCallbackUrl = defineSecret("PESAPAY_CALLBACK_URL");
const apiBase = "https://cybqa.pesapal.com/pesapalv3";

const send = (res, status, body) => res.status(status).set("Access-Control-Allow-Origin", "*").json(body);

exports.createPesapalPayment = onRequest({ secrets: [pesapayKey, pesapaySecret, pesapayIpnId, pesapayCallbackUrl], cors: true }, async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST required" });
  try {
    const authHeader = req.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return send(res, 401, { error: "Sign in as an admin first." });
    const decoded = await getAuth().verifyIdToken(authHeader.slice(7));
    const profile = await getFirestore().doc(`users/${decoded.uid}`).get();
    const role = profile.data()?.role;
    if (role !== "admin" && role !== "super_admin") return send(res, 403, { error: "Only lodge admins can create payment links." });

    const { bookingId, guestName, guestEmail, guestPhone, amount, description } = req.body || {};
    if (!bookingId || !guestName || !guestEmail || !Number(amount) || Number(amount) <= 0) return send(res, 400, { error: "Booking, guest, email, and a positive amount are required." });

    const tokenResponse = await fetch(`${apiBase}/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ consumer_key: pesapayKey.value(), consumer_secret: pesapaySecret.value() }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.token) return send(res, 502, { error: "Pesapal authentication failed.", details: tokenData });

    const order = {
      id: bookingId,
      currency: "UGX",
      amount: Number(amount),
      description: description || "Tembo Safari Lodge reservation",
      callback_url: pesapayCallbackUrl.value(),
      notification_id: pesapayIpnId.value(),
      billing_address: { email_address: guestEmail, phone_number: guestPhone || "", first_name: guestName },
    };
    const orderResponse = await fetch(`${apiBase}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: `Bearer ${tokenData.token}` },
      body: JSON.stringify(order),
    });
    const orderData = await orderResponse.json();
    if (!orderResponse.ok || !orderData.redirect_url) return send(res, 502, { error: "Pesapal could not create the payment link.", details: orderData });

    await getFirestore().doc(`bookings/${bookingId}`).set({ payment_link: orderData.redirect_url, pesapal_tracking_id: orderData.order_tracking_id || "", payment_status: "payment_link_sent", updated_at: new Date().toISOString() }, { merge: true });
    return send(res, 200, { redirect_url: orderData.redirect_url, order_tracking_id: orderData.order_tracking_id || "" });
  } catch (error) {
    console.error("createPesapalPayment failed", error);
    return send(res, 500, { error: "Could not create the Pesapal payment link." });
  }
});
