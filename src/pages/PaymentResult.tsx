import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(params.get("status") || "PENDING");
  const trackingId = params.get("OrderTrackingId");
  const workerUrl = import.meta.env.VITE_PESAPAL_WORKER_URL;

  useEffect(() => {
    if (!trackingId || !workerUrl) return;
    let cancelled = false;
    fetch(`${workerUrl}/status?OrderTrackingId=${encodeURIComponent(trackingId)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Payment status request failed.");
        return response.json() as Promise<{ normalized_status?: string }>;
      })
      .then((data) => {
        if (!cancelled && data.normalized_status) setStatus(data.normalized_status);
      })
      .catch(() => {
        // The callback status remains visible when the status service is unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, [trackingId, workerUrl]);

  const isSuccess = status === "COMPLETED" || status === "success";
  const isFailed = status === "FAILED";
  return <div className="min-h-screen bg-background"><Navbar /><main className="safari-container flex min-h-[70vh] items-center justify-center py-32"><section className="max-w-lg text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">{isSuccess ? <CheckCircle2 size={34} /> : <Clock3 size={34} />}</div><p className="mb-3 text-sm font-semibold uppercase text-secondary">Tembo Safari Lodge</p><h1 className="mb-5 font-display text-4xl font-bold">{isSuccess ? "Payment received" : isFailed ? "Payment not completed" : "Payment processing"}</h1><p className="mb-8 text-lg text-muted-foreground">{isSuccess ? "Thank you. The lodge team will confirm your reservation personally." : isFailed ? "The payment was not completed. Please contact the lodge team if you need help." : "Your payment provider is processing the result. The lodge team will confirm your reservation shortly."}</p><Link to="/" className="safari-btn-primary">Return to the lodge</Link></section></main></div>;
};

export default PaymentResult;
