import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import gorillaImage from "@/assets/gorilla-trekking.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import fallsImage from "@/assets/murchison-falls.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";
import safariTourImage from "@/assets/safari-tour.jpg";
import heroImage from "@/assets/hero-safari.jpg";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Tips for Your First Gorilla Trekking Experience",
    excerpt: "Prepare for an unforgettable encounter with mountain gorillas with our comprehensive guide covering fitness preparation, what to pack, and ethical guidelines.",
    image: gorillaImage,
    author: "Joseph Mukasa",
    date: "January 15, 2025",
    readTime: "8 min read",
    category: "Travel Tips",
    featured: true,
  },
  {
    id: 2,
    title: "Best Time to Visit Uganda's National Parks",
    excerpt: "Discover the optimal seasons for wildlife viewing, gorilla trekking, and bird watching across Uganda's diverse national parks.",
    image: lionImage,
    author: "Grace Nakato",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Planning",
    featured: false,
  },
  {
    id: 3,
    title: "The Magic of Murchison Falls: A Complete Guide",
    excerpt: "Everything you need to know about exploring Africa's most powerful waterfall and the incredible wildlife that calls this park home.",
    image: fallsImage,
    author: "David Okello",
    date: "January 5, 2025",
    readTime: "10 min read",
    category: "Destinations",
    featured: false,
  },
  {
    id: 4,
    title: "Why Kidepo Valley is Africa's Best-Kept Secret",
    excerpt: "Discover the untouched wilderness of Kidepo Valley National Park, often called the most beautiful park in Africa.",
    image: kidepoImage,
    author: "Joseph Mukasa",
    date: "December 28, 2024",
    readTime: "7 min read",
    category: "Destinations",
    featured: false,
  },
  {
    id: 5,
    title: "Sustainable Safari: How We Protect Uganda's Wildlife",
    excerpt: "Learn about our commitment to conservation and how your safari experience contributes to protecting endangered species.",
    image: heroImage,
    author: "Grace Nakato",
    date: "December 20, 2024",
    readTime: "5 min read",
    category: "Conservation",
    featured: false,
  },
  {
    id: 6,
    title: "Photography Tips for Your Uganda Safari",
    excerpt: "Expert advice on capturing stunning wildlife photographs during your safari adventure, from equipment to techniques.",
    image: safariTourImage,
    author: "David Okello",
    date: "December 15, 2024",
    readTime: "9 min read",
    category: "Travel Tips",
    featured: false,
  },
];

const Blog = () => {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImage}
            alt="Safari blog"
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
              Our Blog
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Safari <span className="text-secondary">Stories</span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Travel tips, destination guides, and wildlife conservation insights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="safari-section">
          <div className="safari-container">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-dramatic aspect-[4/3]">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <span className="safari-badge">{featuredPost.category}</span>
                <h2 className="safari-heading text-3xl md:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="safari-text">{featuredPost.excerpt}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User size={16} />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {featuredPost.readTime}
                  </span>
                </div>

                <button className="safari-btn-primary inline-flex items-center gap-2">
                  Read Article
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="safari-section bg-muted">
        <div className="safari-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="safari-heading mb-6">Latest Articles</h2>
            <p className="safari-text">
              Explore our collection of travel guides, tips, and safari stories
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="safari-card group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <User size={14} />
                      {post.author}
                    </span>
                    <button className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
