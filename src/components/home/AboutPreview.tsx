import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import safariTourImage from "@/assets/safari-tour.jpg";

const highlights = [
  "Expert local guides with 15+ years of experience",
  "Sustainable and eco-friendly tourism practices",
  "Small group tours for personalized experiences",
  "24/7 support throughout your journey",
];

const AboutPreview = () => {
  return (
    <section className="safari-section bg-muted">
      <div className="safari-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-dramatic">
              <img
                src={safariTourImage}
                alt="Safari tour experience in Uganda"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-8 -right-8 md:bottom-8 md:right-8 bg-primary text-primary-foreground p-6 rounded-2xl shadow-dramatic"
            >
              <div className="text-center">
                <span className="block text-4xl font-display font-bold text-secondary">10+</span>
                <span className="text-sm uppercase tracking-wide opacity-90">Years of Excellence</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="safari-badge mb-4">About Us</span>
            <h2 className="safari-heading mb-6">
              Your Gateway to <br />
              <span className="text-primary">African Adventures</span>
            </h2>
            <p className="safari-text mb-8">
              At Rio Safaris Uganda, we're passionate about sharing the incredible beauty 
              and wildlife of our homeland with adventurers from around the world. With over 
              a decade of experience, we craft authentic safari experiences that connect you 
              with nature while supporting local communities and conservation efforts.
            </p>

            {/* Highlights */}
            <ul className="space-y-4 mb-10">
              {highlights.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="text-secondary flex-shrink-0" size={24} />
                  <span className="text-foreground font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/about"
              className="safari-btn-primary inline-flex items-center gap-2"
            >
              Learn More About Us
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
