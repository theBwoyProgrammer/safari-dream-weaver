import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="safari-section bg-background">
      <div className="safari-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-primary to-safari-moss rounded-3xl overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-accent rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 p-10 md:p-16 text-primary-foreground text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-5 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold uppercase tracking-wider mb-6"
            >
              Ready for Adventure?
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Start Planning Your <br />
              <span className="text-secondary">Dream Safari</span> Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10"
            >
              Let us help you create an unforgettable journey through Uganda's wilderness. 
              Contact our team today for a personalized safari experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link to="/contact" className="safari-btn-secondary flex items-center gap-2">
                Get in Touch
                <ArrowRight size={20} />
              </Link>
              <Link to="/tours" className="safari-btn-outline">
                Browse Tours
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/80"
            >
              <a href="tel:+256700000000" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone size={20} />
                <span>+256 700 000 000</span>
              </a>
              <a href="mailto:info@riosafarisuganda.com" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail size={20} />
                <span>info@riosafarisuganda.com</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
