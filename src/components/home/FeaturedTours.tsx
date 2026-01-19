import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Users, MapPin, ArrowRight } from "lucide-react";
import gorillaImage from "@/assets/gorilla-trekking.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import fallsImage from "@/assets/murchison-falls.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";

const tours = [
  {
    id: 1,
    title: "Gorilla Trekking Adventure",
    location: "Bwindi Impenetrable Forest",
    duration: "3 Days",
    groupSize: "8 People",
    price: "$1,500",
    image: gorillaImage,
    featured: true,
  },
  {
    id: 2,
    title: "Queen Elizabeth Safari",
    location: "Queen Elizabeth National Park",
    duration: "4 Days",
    groupSize: "12 People",
    price: "$1,200",
    image: lionImage,
    featured: false,
  },
  {
    id: 3,
    title: "Murchison Falls Explorer",
    location: "Murchison Falls National Park",
    duration: "3 Days",
    groupSize: "10 People",
    price: "$950",
    image: fallsImage,
    featured: false,
  },
  {
    id: 4,
    title: "Kidepo Valley Expedition",
    location: "Kidepo Valley National Park",
    duration: "5 Days",
    groupSize: "8 People",
    price: "$1,800",
    image: kidepoImage,
    featured: false,
  },
];

const FeaturedTours = () => {
  return (
    <section id="featured-tours" className="safari-section bg-background">
      <div className="safari-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="safari-badge mb-4">Our Adventures</span>
          <h2 className="safari-heading mb-6">
            Unforgettable Safari Experiences
          </h2>
          <p className="safari-text">
            From gorilla trekking in misty forests to game drives across endless savannas, 
            discover Uganda's incredible wildlife and natural wonders.
          </p>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <motion.article
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`safari-card group ${
                tour.featured ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Link to={`/tours/${tour.id}`} className="block">
                <div className={`relative overflow-hidden ${
                  tour.featured ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}>
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold text-sm">
                    From {tour.price}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                    <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
                      <MapPin size={14} />
                      <span>{tour.location}</span>
                    </div>
                    <h3 className={`font-display font-bold mb-3 ${
                      tour.featured ? "text-2xl md:text-3xl" : "text-xl"
                    }`}>
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {tour.groupSize}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/tours"
            className="safari-btn-primary inline-flex items-center gap-2"
          >
            View All Tours
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTours;
