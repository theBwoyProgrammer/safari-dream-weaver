import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-safari.jpg";
import lionImage from "@/assets/lion-safari.jpg";
import safariTourImage from "@/assets/safari-tour.jpg";
import kidepoImage from "@/assets/kidepo-wildlife.jpg";

const guides=[
  {title:"Kazinga Channel boat cruises",text:"Watch hippos, elephants, buffalo, and prolific birdlife from the water near the lodge.",image:heroImage,category:"On the water"},
  {title:"Guided game drives",text:"Set out through Queen Elizabeth National Park in search of lions, elephants, antelope, and more.",image:lionImage,category:"Wildlife"},
  {title:"Nature walks & bird watching",text:"Slow down and discover the smaller details, habitats, and remarkable birdlife around Katunguru.",image:kidepoImage,category:"On foot"},
  {title:"Biking & fishing tours",text:"Ask our team to help arrange an active local experience during your stay.",image:safariTourImage,category:"Local experiences"},
];
const Blog=()=> <div className="min-h-screen bg-background"><Navbar/><section className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-40"><div className="absolute inset-0 opacity-20"><img src={heroImage} alt="Kazinga Channel wildlife" className="h-full w-full object-cover"/></div><div className="safari-container relative z-10 text-center"><span className="mb-6 inline-block rounded-full bg-secondary/20 px-5 py-2 text-sm font-semibold uppercase text-secondary">Explore nearby</span><h1 className="mb-6 text-5xl font-bold md:text-7xl">Your days at <span className="text-secondary">Tembo</span></h1><p className="mx-auto max-w-2xl text-xl text-primary-foreground/90">Make the most of your stay with classic Queen Elizabeth National Park experiences.</p></div></section><section className="safari-section"><div className="safari-container"><div className="mb-12 grid gap-8 border-b border-border pb-12 md:grid-cols-3"><div><MapPin className="mb-4 text-primary"/><h2 className="mb-2 text-xl font-bold">Start in Katunguru</h2><p className="text-muted-foreground">The lodge sits close to the Kazinga Channel and convenient park activity routes.</p></div><div><Clock className="mb-4 text-primary"/><h2 className="mb-2 text-xl font-bold">Plan with our team</h2><p className="text-muted-foreground">Ask before arrival so we can help you organise activities around your stay.</p></div><div><ArrowRight className="mb-4 text-primary"/><h2 className="mb-2 text-xl font-bold">Stay flexible</h2><p className="text-muted-foreground">Choose one experience or combine several for a fuller park visit.</p></div></div><div className="grid gap-7 md:grid-cols-2">{guides.map((guide,index)=><motion.article key={guide.title} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.08}} className="safari-card"><img src={guide.image} alt={guide.title} className="aspect-[16/9] w-full object-cover"/><div className="p-7"><span className="mb-3 block text-sm font-semibold uppercase text-secondary">{guide.category}</span><h2 className="mb-3 text-2xl font-bold">{guide.title}</h2><p className="mb-6 text-muted-foreground">{guide.text}</p><Link to="/contact" className="inline-flex items-center gap-2 font-semibold text-primary">Ask about this activity <ArrowRight size={17}/></Link></div></motion.article>)}</div></div></section><Footer/></div>;
export default Blog;
