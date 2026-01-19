import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Play } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="African elephant at sunset in Uganda"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 safari-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 safari-container text-center text-primary-foreground py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-5 py-2 bg-secondary/90 text-secondary-foreground rounded-full text-sm font-semibold uppercase tracking-wider mb-8"
          >
            Welcome to Uganda's Premier Safari Experience
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            Discover the
            <span className="block text-secondary">Wild Heart</span>
            of Africa
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Embark on unforgettable adventures through Uganda's breathtaking landscapes, 
            encounter majestic wildlife, and create memories that last a lifetime.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/tours" className="safari-btn-secondary">
              Explore Our Tours
            </Link>
            <button className="safari-btn-outline flex items-center gap-2 group">
              <Play size={20} className="group-hover:scale-110 transition-transform" />
              Watch Video
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a
            href="#featured-tours"
            className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
