import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BedDouble, Check, ShowerHead, Trees, Wifi, Utensils } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import lodgeHero from "@/assets/tembo-lodge-hero.jpg";
import { fetchRoomPackages, fetchRoomTypes, type RoomPackage, type RoomType } from "@/lib/lodge";
import { fetchSiteImage } from "@/lib/content";

const amenities = [{icon: ShowerHead,label:"Hot shower"},{icon: Trees,label:"Private balcony"},{icon: BedDouble,label:"Mosquito net"},{icon: Wifi,label:"Self-contained"},{icon: Utensils,label:"Restaurant & bar"}];

const Tours = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [packages, setPackages] = useState<RoomPackage[]>([]);
  const [managedHero, setManagedHero] = useState<string | null>(null);
  useEffect(() => {
    void fetchRoomTypes().then((items) => { if (items.length > 0) setRooms(items); }).catch(() => undefined);
    void fetchRoomPackages().then(setPackages).catch(() => undefined);
    void fetchSiteImage("rooms_hero").then(setManagedHero).catch(() => undefined);
  }, []);
  const displayedRooms = packages.map((pkg) => ({ ...pkg, roomName: rooms.find((room) => room.id === pkg.room_id)?.name || "Accommodation" }));
  return <div className="min-h-screen bg-background"><Navbar />
  <section className="relative overflow-hidden bg-primary py-32 text-primary-foreground md:py-40"><div className="absolute inset-0 opacity-20"><img src={managedHero || lodgeHero} alt="Tembo Safari Lodge accommodation" width={1920} height={1280} loading="lazy" className="h-full w-full object-cover object-center" /></div><div className="safari-container relative z-10 text-center"><span className="mb-6 inline-block rounded-full bg-secondary/20 px-5 py-2 text-sm font-semibold uppercase text-secondary">Accommodation</span><h1 className="mb-6 font-display text-5xl font-bold md:text-7xl">Rooms & <span className="text-secondary">rates</span></h1><p className="mx-auto max-w-2xl text-xl text-primary-foreground/90">Choose the room and meal plan that suits your stay in Queen Elizabeth National Park.</p></div></section>
  <section className="border-b border-border bg-muted py-7"><div className="safari-container flex flex-wrap justify-center gap-x-8 gap-y-3">{amenities.map(item=><span key={item.label} className="flex items-center gap-2 text-sm font-medium"><item.icon className="text-primary" size={18}/>{item.label}</span>)}</div></section>
  <section className="safari-section"><div className="safari-container"><div className="mb-12 max-w-3xl"><span className="safari-badge mb-4">Stay your way</span><h2 className="safari-heading mb-5">Packages and offerings</h2><p className="safari-text">Choose an accommodation package and see exactly what is included in the price.</p></div>{displayedRooms.length === 0 ? <p className="rounded-lg bg-muted p-8 text-center text-muted-foreground">Accommodation packages will be published soon.</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{displayedRooms.map((pkg,index)=><motion.article key={pkg.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.06}} className="safari-card flex flex-col p-7"><span className="mb-3 text-sm font-semibold uppercase text-secondary">{pkg.roomName}</span><h3 className="mb-4 text-2xl font-bold">{pkg.name}</h3><div className="mb-6 flex items-end gap-2"><strong className="text-5xl text-primary">${Number(pkg.price).toFixed(2)}</strong><span className="pb-1 text-muted-foreground">per room</span></div><ul className="mb-8 space-y-3">{pkg.offerings.map((offering) => <li key={offering} className="flex items-start gap-2 text-muted-foreground"><Check size={17} className="mt-0.5 shrink-0 text-primary" />{offering}</li>)}</ul><Link to="/contact" className="safari-btn-primary mt-auto w-full">Book this package</Link></motion.article>)}</div>}</div></section>
  <CallToAction/><Footer/></div>;
};
export default Tours;
