import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const isSuccess = status === "COMPLETED" || status === "success";
  return <div className="min-h-screen bg-background"><Navbar /><main className="safari-container flex min-h-[70vh] items-center justify-center py-32"><section className="max-w-lg text-center"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">{isSuccess ? <CheckCircle2 size={34} /> : <Clock3 size={34} />}</div><p className="mb-3 text-sm font-semibold uppercase text-secondary">Tembo Safari Lodge</p><h1 className="mb-5 font-display text-4xl font-bold">{isSuccess ? "Payment received" : "Payment processing"}</h1><p className="mb-8 text-lg text-muted-foreground">{isSuccess ? "Thank you. The lodge team will confirm your reservation personally." : "Your payment provider is processing the result. The lodge team will confirm your reservation shortly."}</p><Link to="/" className="safari-btn-primary">Return to the lodge</Link></section></main></div>;
};

export default PaymentResult;
