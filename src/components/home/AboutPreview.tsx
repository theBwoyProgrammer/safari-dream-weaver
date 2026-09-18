import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import safariTourImage from "@/assets/safari-tour.jpg";

const highlights = ["Just 300 metres from the Kazinga Channel", "Private balconies and self-contained bathrooms", "Frequent views of hippos, birds, and wildlife", "Onsite restaurant and bar"];
const AboutPreview = () => (
  <section className="safari-section bg-muted"><div className="safari-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
    <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-lg shadow-dramatic"><img src={safariTourImage} alt="Queen Elizabeth National Park near Tembo Safari Lodge" className="aspect-[4/3] w-full object-cover" /><div className="absolute bottom-0 inset-x-0 bg-primary/90 p-5 text-primary-foreground"><strong className="text-2xl text-secondary">300m</strong><span className="ml-3">from the Kazinga Channel</span></div></motion.div>
    <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><span className="safari-badge mb-4">A stay in the wild</span><h2 className="safari-heading mb-6">At home in <span className="text-primary">Katunguru</span></h2><p className="safari-text mb-8">Tembo Safari Lodge is an easy-going base inside Queen Elizabeth National Park, ideal for travellers who want nature, comfort, and value close to the park's best-known waterway.</p><ul className="mb-9 space-y-4">{highlights.map(item => <li key={item} className="flex items-center gap-3"><CheckCircle className="shrink-0 text-secondary" size={22} /><span>{item}</span></li>)}</ul><Link to="/about" className="safari-btn-primary gap-2">Discover the lodge <ArrowRight size={19} /></Link></motion.div>
  </div></section>
);
export default AboutPreview;
