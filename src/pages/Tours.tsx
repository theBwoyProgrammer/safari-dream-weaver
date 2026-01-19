import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, MapPin, Star, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import gorillaImage from "@/assets/gorilla-trekking.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import fallsImage from "@/assets/murchison-falls.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";
import safariTourImage from "@/assets/safari-tour.jpg";
import heroImage from "@/assets/hero-safari.jpg";

const allTours = [
  {
    id: 1,
    title: "Gorilla Trekking Adventure",
    location: "Bwindi Impenetrable Forest",
    duration: "3 Days",
    groupSize: "8 People",
    price: 1500,
    rating: 5,
    reviews: 128,
    image: gorillaImage,
    category: "Wildlife",
    description: "Trek through misty forests to encounter endangered mountain gorillas in their natural habitat.",
  },
  {
    id: 2,
    title: "Queen Elizabeth Safari",
    location: "Queen Elizabeth National Park",
    duration: "4 Days",
    groupSize: "12 People",
    price: 1200,
    rating: 5,
    reviews: 95,
    image: lionImage,
    category: "Safari",
    description: "Experience classic African safari with tree-climbing lions and diverse wildlife.",
  },
  {
    id: 3,
    title: "Murchison Falls Explorer",
    location: "Murchison Falls National Park",
    duration: "3 Days",
    groupSize: "10 People",
    price: 950,
    rating: 5,
    reviews: 76,
    image: fallsImage,
    category: "Adventure",
    description: "Witness the world's most powerful waterfall and abundant wildlife.",
  },
  {
    id: 4,
    title: "Kidepo Valley Expedition",
    location: "Kidepo Valley National Park",
    duration: "5 Days",
    groupSize: "8 People",
    price: 1800,
    rating: 5,
    reviews: 54,
    image: kidepoImage,
    category: "Safari",
    description: "Explore Africa's most pristine and remote wilderness.",
  },
  {
    id: 5,
    title: "Big Five Safari",
    location: "Multiple Parks",
    duration: "7 Days",
    groupSize: "10 People",
    price: 2500,
    rating: 5,
    reviews: 112,
    image: safariTourImage,
    category: "Safari",
    description: "The ultimate Uganda safari covering multiple national parks.",
  },
  {
    id: 6,
    title: "Chimpanzee Tracking",
    location: "Kibale National Park",
    duration: "2 Days",
    groupSize: "8 People",
    price: 650,
    rating: 5,
    reviews: 89,
    image: heroImage,
    category: "Wildlife",
    description: "Track our closest relatives in the primate capital of the world.",
  },
];

const categories = ["All", "Safari", "Wildlife", "Adventure"];

const Tours = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  const filteredTours = allTours
    .filter((tour) => selectedCategory === "All" || tour.category === selectedCategory)
    .sort((a, b) => {
      if (priceSort === "asc") return a.price - b.price;
      if (priceSort === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={safariTourImage}
            alt="Safari tour"
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
              Our Tours
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Safari <span className="text-secondary">Adventures</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Choose from our handcrafted safari experiences across Uganda's finest destinations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="safari-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-primary/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Price Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by price:</span>
              <button
                onClick={() => setPriceSort(priceSort === "asc" ? null : "asc")}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  priceSort === "asc" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-primary/10"
                }`}
              >
                Low to High
              </button>
              <button
                onClick={() => setPriceSort(priceSort === "desc" ? null : "desc")}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  priceSort === "desc" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-primary/10"
                }`}
              >
                High to Low
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="safari-section">
        <div className="safari-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, index) => (
              <motion.article
                key={tour.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="safari-card group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                      {tour.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold">
                    ${tour.price}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="text-secondary fill-secondary" size={16} />
                    <span className="text-sm font-medium">{tour.rating}.0</span>
                    <span className="text-sm text-muted-foreground">({tour.reviews} reviews)</span>
                  </div>

                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {tour.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {tour.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {tour.groupSize}
                      </span>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                      Book Now →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default Tours;
