import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import lodgeFlyer from "@/assets/tembo-safari-lodge-rates.jpeg";
import heroImage from "@/assets/hero-safari.jpg";
import gorillaImage from "@/assets/hippo-safari.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import fallsImage from "@/assets/murchison-falls.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";
import safariTourImage from "@/assets/safari-tour.jpg";
import image1 from "@/assets/image-1.jpeg";
import image2 from "@/assets/image-2.jpeg";
import image3 from "@/assets/image-3.jpeg";
import image4 from "@/assets/image-4.jpeg";
import image5 from "@/assets/image-5.jpeg";
import image6 from "@/assets/image-6.jpeg";
import image7 from "@/assets/image-7.jpeg";

const galleryImages = [
  { src: image4, title: "Sunrise over the lodge", category: "The Lodge" },
  { src: image3, title: "Tembo from above", category: "The Lodge" },
  { src: image5, title: "A warm lodge welcome", category: "The Lodge" },
  { src: image1, title: "Dining at Tembo", category: "The Lodge" },
  { src: image7, title: "Dinner with a view", category: "The Lodge" },
  { src: image2, title: "Golden hour at the lake", category: "Landscapes" },
  { src: image6, title: "A balcony view", category: "Landscapes" },
  { src: lodgeFlyer, title: "Tembo Safari Lodge rates", category: "The Lodge" },
  { src: heroImage, title: "Wildlife at sunset", category: "Wildlife" },
  { src: lionImage, title: "Queen Elizabeth wildlife", category: "Wildlife" },
  { src: safariTourImage, title: "Game drive country", category: "Activities" },
  { src: kidepoImage, title: "Uganda's open landscapes", category: "Landscapes" },
  { src: gorillaImage, title: "Uganda wildlife encounters", category: "Wildlife" },
  { src: fallsImage, title: "Uganda's waterways", category: "Landscapes" },
];
const categories = ["All", "The Lodge", "Wildlife", "Activities", "Landscapes"];

const Gallery = () => {
  const [selectedCategory,setSelectedCategory]=useState("All");
  const [lightboxIndex,setLightboxIndex]=useState<number | null>(null);
  const images=galleryImages.filter(image=>selectedCategory==="All"||image.category===selectedCategory);
  const next=()=>setLightboxIndex(current=>current===null?null:(current+1)%images.length);
  const previous=()=>setLightboxIndex(current=>current===null?null:(current-1+images.length)%images.length);
  const selectedImage=lightboxIndex===null?null:images[lightboxIndex];
  return <div className="min-h-screen bg-background"><Navbar/><section className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-40"><div className="absolute inset-0 opacity-20"><img src={lodgeFlyer} alt="Tembo Safari Lodge" className="h-full w-full object-cover object-top"/></div><div className="safari-container relative z-10 text-center"><span className="mb-6 inline-block rounded-full bg-secondary/20 px-5 py-2 text-sm font-semibold uppercase text-secondary">Gallery</span><h1 className="mb-6 text-5xl font-bold md:text-7xl">Life around <span className="text-secondary">Tembo</span></h1><p className="text-xl text-primary-foreground/90">A glimpse of the lodge, landscapes, and wildlife that make this place special.</p></div></section><section className="border-b border-border bg-muted py-8"><div className="safari-container flex flex-wrap justify-center gap-2">{categories.map(category=><button key={category} onClick={()=>{setSelectedCategory(category);setLightboxIndex(null)}} className={`rounded-full px-5 py-2 text-sm font-medium ${selectedCategory===category?"bg-primary text-primary-foreground":"bg-card text-foreground"}`}>{category}</button>)}</div></section><section className="safari-section"><div className="safari-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.map((image,index)=><motion.button layout key={`${image.title}-${index}`} onClick={()=>setLightboxIndex(index)} className="group relative aspect-[4/3] overflow-hidden rounded-lg text-left"><img src={image.src} alt={image.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 to-transparent p-5 pt-14 text-primary-foreground"><h2 className="text-xl font-bold">{image.title}</h2><p className="text-sm opacity-80">{image.category}</p></div></motion.button>)}</div></section><AnimatePresence>{selectedImage&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4" onClick={()=>setLightboxIndex(null)}><button aria-label="Close image" className="absolute right-5 top-5 text-primary-foreground" onClick={()=>setLightboxIndex(null)}><X size={32}/></button><button aria-label="Previous image" className="absolute left-4 text-primary-foreground" onClick={event=>{event.stopPropagation();previous()}}><ChevronLeft size={38}/></button><img src={selectedImage.src} alt={selectedImage.title} onClick={event=>event.stopPropagation()} className="max-h-[82vh] max-w-[80vw] rounded-lg object-contain"/><button aria-label="Next image" className="absolute right-4 text-primary-foreground" onClick={event=>{event.stopPropagation();next()}}><ChevronRight size={38}/></button></motion.div>}</AnimatePresence><CallToAction/><Footer/></div>;
};
export default Gallery;
