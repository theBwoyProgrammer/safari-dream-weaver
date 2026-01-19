import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United States",
    rating: 5,
    text: "An absolutely life-changing experience! Seeing the mountain gorillas up close was something I'll never forget. The guides were incredibly knowledgeable and made us feel safe throughout the trek.",
    tour: "Gorilla Trekking Adventure",
  },
  {
    id: 2,
    name: "Marcus Weber",
    location: "Germany",
    rating: 5,
    text: "Rio Safaris exceeded all our expectations. From the moment we arrived until we left, everything was perfectly organized. The wildlife sightings were incredible!",
    tour: "Queen Elizabeth Safari",
  },
  {
    id: 3,
    name: "Emily Chen",
    location: "Australia",
    rating: 5,
    text: "The best safari company in Uganda, hands down. Their commitment to sustainable tourism and supporting local communities really sets them apart. Highly recommend!",
    tour: "Murchison Falls Explorer",
  },
  {
    id: 4,
    name: "James Okonkwo",
    location: "Nigeria",
    rating: 5,
    text: "A magical journey through Uganda's wilderness. The guides shared fascinating stories about the wildlife and culture. Can't wait to come back!",
    tour: "Kidepo Valley Expedition",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="safari-section bg-primary text-primary-foreground overflow-hidden">
      <div className="safari-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-5 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            What Our Adventurers Say
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Don't just take our word for it. Here's what travelers from around the world 
            have to say about their experiences with Rio Safaris Uganda.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center px-8 md:px-16"
            >
              {/* Quote Icon */}
              <Quote className="mx-auto text-secondary/30 mb-8" size={64} />

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="text-secondary fill-secondary" size={24} />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="font-display text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Author */}
              <div className="space-y-1">
                <p className="font-display text-xl font-bold text-secondary">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-primary-foreground/70">
                  {testimonials[currentIndex].location}
                </p>
                <p className="text-primary-foreground/50 text-sm">
                  {testimonials[currentIndex].tour}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-secondary w-8"
                    : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
