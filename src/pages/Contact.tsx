import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/tembo-lodge-hero.jpg";

const contactInfo = [
  { icon: MapPin, title: "Our Location", details: ["P.O. Box 23008", "Queen Elizabeth National Park, Katunguru"] },
  { icon: Phone, title: "Call Us", details: ["+256 701 628 803", "+256 772 423 037"] },
  { icon: Mail, title: "Email Us", details: ["info@tembosafari.com"] },
  { icon: Clock, title: "Opening", details: ["Open daily for travellers"] },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${formData.subject || "Lodge enquiry"} from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`);
    window.location.href = `mailto:info@tembosafari.com?subject=${subject}&body=${body}`;
  };

  return <div className="min-h-screen bg-background"><Navbar />
    <section className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-40"><div className="absolute inset-0 opacity-20"><img src={heroImage} alt="Tembo Safari Lodge in Queen Elizabeth National Park" width={1920} height={1280} loading="lazy" className="h-full w-full object-cover" /></div><div className="safari-container relative z-10 text-center"><span className="mb-6 inline-block rounded-full bg-secondary/20 px-5 py-2 text-sm font-semibold uppercase text-secondary">Contact Tembo</span><h1 className="mb-6 font-display text-5xl font-bold md:text-7xl">Plan your <span className="text-secondary">stay</span></h1><p className="mx-auto max-w-2xl text-xl text-primary-foreground/90">Ask about rooms, dining, group visits, activities, or directions before arriving in Katunguru.</p></div></section>
    <section className="bg-muted py-16"><div className="safari-container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{contactInfo.map((info,index)=><motion.div key={info.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.08}} className="bg-card p-6 text-center shadow-soft"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><info.icon className="text-primary"/></div><h3 className="mb-3 text-lg font-bold">{info.title}</h3>{info.details.map(detail=><p key={detail} className="text-sm text-muted-foreground">{detail}</p>)}</motion.div>)}</div></section>
    <section className="safari-section"><div className="safari-container grid gap-12 lg:grid-cols-2"><div><span className="safari-badge mb-4">Send an enquiry</span><h2 className="safari-heading mb-6">How can we help?</h2><p className="safari-text mb-8">Complete the details below to open a ready-to-send email to the lodge team.</p><form onSubmit={handleSubmit} className="space-y-6"><div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-medium">Your name *<input required name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3" placeholder="Your name" /></label><label className="text-sm font-medium">Email address *<input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3" placeholder="you@example.com" /></label></div><div className="grid gap-6 sm:grid-cols-2"><label className="text-sm font-medium">Phone number<input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3" placeholder="+256 ..." /></label><label className="text-sm font-medium">What can we help with?<select name="subject" value={formData.subject} onChange={handleChange} className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3"><option value="">Choose an enquiry</option><option>Room booking</option><option>Dining</option><option>Group visit</option><option>Directions</option><option>Activities</option><option>Other enquiry</option></select></label></div><label className="block text-sm font-medium">Your message *<textarea required name="message" value={formData.message} onChange={handleChange} rows={6} className="mt-2 w-full resize-none rounded-md border border-border bg-card px-4 py-3" placeholder="Dates, number of guests, room preference, or your question..." /></label><Button type="submit" size="lg" className="rounded-full px-8"><Send className="mr-2" size={18}/>Create email enquiry</Button></form></div>
      <div className="min-h-[500px] overflow-hidden rounded-lg bg-muted"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8090239278195!2d30.042213574354932!3d-0.12368553545916246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19df51e60b1ce221%3A0x9f605a7217e8473b!2sTembo%20Safari%20Lodge%20Katunguru!5e0!3m2!1sen!2sus!4v1790957337078!5m2!1sen!2sus" width="100%" height="100%" className="min-h-[500px] border-0" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="Tembo Safari Lodge in Katunguru" /></div>
    </div></section><Footer/></div>;
};
export default Contact;
