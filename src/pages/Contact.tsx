import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-safari.jpg";

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Location",
    details: ["Plot 24, Kampala Road", "Kampala, Uganda"],
  },
  {
    icon: Phone,
    title: "Phone Number",
    details: ["+256 700 000 000", "+256 750 000 000"],
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["info@riosafarisuganda.com", "bookings@riosafarisuganda.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM"],
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the form data to a server
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImage}
            alt="Contact us"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="safari-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-5 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
              Contact Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Get in <span className="text-secondary">Touch</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              We'd love to hear from you. Let us help plan your dream safari adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-muted">
        <div className="safari-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card p-6 rounded-2xl shadow-soft text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                  <info.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-lg font-bold mb-3">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-muted-foreground text-sm">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="safari-section">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="safari-badge mb-4">Send a Message</span>
              <h2 className="safari-heading mb-6">
                Plan Your <span className="text-primary">Safari</span>
              </h2>
              <p className="safari-text mb-8">
                Fill out the form below and our team will get back to you within 24 hours 
                with a personalized safari proposal.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tour Interest</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="">Select a tour</option>
                      <option value="gorilla">Gorilla Trekking</option>
                      <option value="safari">Wildlife Safari</option>
                      <option value="adventure">Adventure Tours</option>
                      <option value="custom">Custom Package</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your dream safari..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="safari-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle size={20} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-muted rounded-3xl overflow-hidden h-full min-h-[400px] lg:min-h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255346.48489976756!2d32.45029225!3d0.31362805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0f90c2e56d%3A0x1a93c227a0ef1be9!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "500px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rio Safaris Uganda Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
