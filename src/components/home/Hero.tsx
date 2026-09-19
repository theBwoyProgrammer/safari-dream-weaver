import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin } from "lucide-react";
import heroImage from "@/assets/tembo-lodge-hero.jpg";

const Hero = () => (
  <section className="relative flex min-h-[92vh] items-center overflow-hidden">
    <div className="absolute inset-0"><img src={heroImage} alt="Thatched safari cottages overlooking the landscape near the Kazinga Channel" width={1920} height={1280} className="h-full w-full object-cover" /><div className="absolute inset-0 safari-overlay" /></div>
    <div className="safari-container relative z-10 w-full py-32 text-primary-foreground">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-4xl">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground"><MapPin size={16} /> Katunguru · Queen Elizabeth National Park</span>
        <h1 className="mb-6 font-display text-5xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl">Tembo Safari Lodge</h1>
        <p className="mb-4 text-2xl font-semibold text-secondary md:text-3xl">Feel the culture, love the stay.</p>
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-primary-foreground/90 md:text-xl">A welcoming, budget-friendly lodge just 300 metres from the Kazinga Channel, surrounded by the wildlife and beauty of Queen Elizabeth National Park.</p>
        <div className="flex flex-col gap-4 sm:flex-row"><Link to="/tours" className="safari-btn-secondary">View rooms & rates</Link><Link to="/contact" className="safari-btn-outline">Ask about your stay</Link></div>
      </motion.div>
      <a href="#featured-tours" aria-label="Explore accommodation" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/80"><ChevronDown className="animate-bounce" /></a>
    </div>
  </section>
);
export default Hero;
