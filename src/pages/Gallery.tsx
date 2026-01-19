import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import gorillaImage from "@/assets/gorilla-trekking.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import fallsImage from "@/assets/murchison-falls.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";
import safariTourImage from "@/assets/safari-tour.jpg";
import heroImage from "@/assets/hero-safari.jpg";

const galleryImages = [
  { id: 1, src: heroImage, title: "Elephant at Sunset", category: "Wildlife" },
  { id: 2, src: gorillaImage, title: "Mountain Gorilla Family", category: "Wildlife" },
  { id: 3, src: lionImage, title: "Tree-Climbing Lions", category: "Wildlife" },
  { id: 4, src: fallsImage, title: "Murchison Falls Rainbow", category: "Landscapes" },
  { id: 5, src: kidepoImage, title: "Kidepo Valley Plains", category: "Landscapes" },
  { id: 6, src: safariTourImage, title: "Safari Adventure", category: "Experience" },
  { id: 7, src: heroImage, title: "Golden Hour Safari", category: "Landscapes" },
  { id: 8, src: gorillaImage, title: "Gorilla Portrait", category: "Wildlife" },
  { id: 9, src: lionImage, title: "Pride at Rest", category: "Wildlife" },
  { id: 10, src: fallsImage, title: "Powerful Falls", category: "Landscapes" },
  { id: 11, src: kidepoImage, title: "Zebra Migration", category: "Wildlife" },
  { id: 12, src: safariTourImage, title: "Giraffe Encounter", category: "Experience" },
];

const categories = ["All", "Wildlife", "Landscapes", "Experience"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === "All" || img.category === selectedCategory
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={lionImage}
            alt="Wildlife"
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
              Gallery
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Safari <span className="text-secondary">Moments</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Explore stunning captures from our adventures across Uganda
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="safari-container">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="safari-section">
        <div className="safari-container">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                    index % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                  }`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={`${index % 5 === 0 ? "aspect-square" : "aspect-[4/3]"}`}>
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end">
                      <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-display text-lg font-bold text-primary-foreground">
                          {image.title}
                        </h3>
                        <p className="text-primary-foreground/80 text-sm">{image.category}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-6 right-6 text-primary-foreground hover:text-secondary transition-colors"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-secondary text-primary-foreground hover:text-secondary-foreground transition-all"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-primary-foreground/10 hover:bg-secondary text-primary-foreground hover:text-secondary-foreground transition-all"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-primary-foreground">
              <h3 className="font-display text-xl font-bold">
                {filteredImages[lightboxIndex].title}
              </h3>
              <p className="text-primary-foreground/80">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CallToAction />
      <Footer />
    </div>
  );
};

export default Gallery;
