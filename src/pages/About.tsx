import { motion } from "framer-motion";
import { Users, Award, Heart, Leaf, Target, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import safariTourImage from "@/assets/safari-tour.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "We are deeply passionate about sharing Uganda's natural wonders with the world.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Every tour we run supports conservation efforts and local communities.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for perfection in every detail of your safari experience.",
  },
  {
    icon: Globe,
    title: "Authenticity",
    description: "We provide genuine, immersive experiences that connect you with Africa.",
  },
];

const stats = [
  { value: "10+", label: "Years Experience" },
  { value: "5,000+", label: "Happy Travelers" },
  { value: "50+", label: "Safari Tours" },
  { value: "100%", label: "5-Star Reviews" },
];

const team = [
  {
    name: "Joseph Mukasa",
    role: "Founder & Lead Guide",
    bio: "With over 15 years of guiding experience, Joseph founded Rio Safaris to share his love for Uganda's wilderness.",
  },
  {
    name: "Grace Nakato",
    role: "Operations Manager",
    bio: "Grace ensures every tour runs smoothly, from logistics to guest experience.",
  },
  {
    name: "David Okello",
    role: "Senior Wildlife Guide",
    bio: "David's expertise in tracking and wildlife behavior makes every safari unforgettable.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={kidepoImage}
            alt="Uganda wildlife"
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
              About Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Your Trusted Safari <span className="text-secondary">Partner</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Crafting authentic African adventures since 2014
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="safari-section">
        <div className="safari-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="safari-badge mb-4">Our Story</span>
              <h2 className="safari-heading mb-6">
                Born from a Love for <span className="text-primary">Uganda's Wild</span>
              </h2>
              <div className="space-y-4 safari-text">
                <p>
                  Rio Safaris Uganda was founded in 2014 by Joseph Mukasa, a native Ugandan 
                  with an unwavering passion for wildlife conservation and tourism. What started 
                  as a small operation with a single vehicle has grown into one of Uganda's most 
                  respected safari companies.
                </p>
                <p>
                  Our mission is simple: to provide exceptional safari experiences that not only 
                  showcase Uganda's incredible biodiversity but also contribute to conservation 
                  efforts and support local communities. We believe that responsible tourism can 
                  be a powerful force for positive change.
                </p>
                <p>
                  Today, we operate over 50 different safari packages across Uganda's most 
                  spectacular national parks, from the misty mountains of Bwindi to the vast 
                  savannas of Kidepo Valley.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={safariTourImage}
                alt="Safari experience"
                className="rounded-3xl shadow-dramatic"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted">
        <div className="safari-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <span className="block font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-muted-foreground font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="safari-section">
        <div className="safari-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="safari-badge mb-4">Our Values</span>
            <h2 className="safari-heading mb-6">What Drives Us</h2>
            <p className="safari-text">
              Our core values guide every decision we make and every tour we create.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <value.icon className="text-primary" size={32} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="safari-section bg-muted">
        <div className="safari-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="safari-badge mb-4">Our Team</span>
            <h2 className="safari-heading mb-6">Meet the Experts</h2>
            <p className="safari-text">
              Our passionate team of guides and staff are dedicated to making your safari 
              experience truly exceptional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-2xl p-8 text-center shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="text-primary" size={40} />
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-secondary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default About;
