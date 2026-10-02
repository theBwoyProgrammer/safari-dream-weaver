import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BedDouble, Check, ShowerHead, Trees, Wifi, Utensils } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import lodgeHero from "@/assets/tembo-lodge-hero.jpg";
import { fetchRoomTypes, type RoomType } from "@/lib/lodge";
import { fetchSiteImage } from "@/lib/content";

const packages = [
  { id: 1, title: "Single Room · Full Board", price: 90, type: "Standard room", board: "Breakfast, lunch & dinner" },
  { id: 2, title: "Single Room · Half Board", price: 80, type: "Standard room", board: "Breakfast plus one main meal" },
  { id: 3, title: "Single Room · Bed & Breakfast", price: 70, type: "Standard room", board: "Breakfast included" },
  { id: 4, title: "Double / Twin · Full Board", price: 120, type: "Double or twin room", board: "Breakfast, lunch & dinner" },
  { id: 5, title: "Double / Twin · Half Board", price: 100, type: "Double or twin room", board: "Breakfast plus one main meal" },
  { id: 6, title: "Double / Twin · Bed & Breakfast", price: 90, type: "Double or twin room", board: "Breakfast included" },
];
const amenities = [{icon: ShowerHead,label:"Hot shower"},{icon: Trees,label:"Private balcony"},{icon: BedDouble,label:"Mosquito net"},{icon: Wifi,label:"Self-contained"},{icon: Utensils,label:"Restaurant & bar"}];

const Tours = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [managedHero, setManagedHero] = useState<string | null>(null);
  useEffect(() => {
    void fetchRoomTypes().then((items) => { if (items.length > 0) setRooms(items); }).catch(() => undefined);
    void fetchSiteImage("rooms_hero").then(setManagedHero).catch(() => undefined);
  }, []);
  const displayedRooms = rooms.length > 0 ? rooms.flatMap((room) => [
    { id: `${room.id}-full`, title: `${room.name} · Full Board`, price: Number(room.price_full_board), type: room.description || "Room", board: "Breakfast, lunch & dinner" },
    { id: `${room.id}-half`, title: `${room.name} · Half Board`, price: Number(room.price_half_board), type: room.description || "Room", board: "Breakfast plus one main meal" },
    { id: `${room.id}-breakfast`, title: `${room.name} · Bed & Breakfast`, price: Number(room.price_bed_breakfast), type: room.description || "Room", board: "Breakfast included" },
  ]) : packages;
  return <div className="min-h-screen bg-background"><Navbar />
  <section className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-40"><div className="absolute inset-0 opacity-20"><img src={managedHero || lodgeHero} alt="Tembo Safari Lodge accommodation" width={1920} height={1280} loading="lazy" className="h-full w-full object-cover object-center" /></div><div className="safari-container relative z-10 text-center"><span className="mb-6 inline-block rounded-full bg-secondary/20 px-5 py-2 text-sm font-semibold uppercase text-secondary">Accommodation</span><h1 className="mb-6 font-display text-5xl font-bold md:text-7xl">Rooms & <span className="text-secondary">rates</span></h1><p className="mx-auto max-w-2xl text-xl text-primary-foreground/90">Choose the room and meal plan that suits your stay in Queen Elizabeth National Park.</p></div></section>
  <section className="border-b border-border bg-muted py-7"><div className="safari-container flex flex-wrap justify-center gap-x-8 gap-y-3">{amenities.map(item=><span key={item.label} className="flex items-center gap-2 text-sm font-medium"><item.icon className="text-primary" size={18}/>{item.label}</span>)}</div></section>
  <section className="safari-section"><div className="safari-container"><div className="mb-12 max-w-3xl"><span className="safari-badge mb-4">Stay your way</span><h2 className="safari-heading mb-5">Room packages</h2><p className="safari-text">Rates are shown in US dollars. Contact the lodge for triple rooms, group visits, availability, and any special arrangements.</p></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{displayedRooms.map((room,index)=><motion.article key={room.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.06}} className="safari-card flex flex-col p-7"><span className="mb-5 text-sm font-semibold uppercase text-secondary">{room.type}</span><h3 className="mb-4 text-2xl font-bold">{room.title}</h3><div className="mb-6 flex items-end gap-2"><strong className="text-5xl text-primary">${room.price}</strong><span className="pb-1 text-muted-foreground">per room</span></div><p className="mb-2 flex items-center gap-2 text-muted-foreground"><Check size={17} className="text-primary" />{room.board}</p><p className="mb-8 flex items-center gap-2 text-muted-foreground"><Check size={17} className="text-primary" />Private bathroom & balcony</p><Link to="/contact" className="safari-btn-primary mt-auto w-full">Book this package</Link></motion.article>)}</div></div></section>
  <CallToAction/><Footer/></div>;
};
export default Tours;
