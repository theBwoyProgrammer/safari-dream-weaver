import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BedDouble, Coffee, Utensils, ArrowRight, Check } from "lucide-react";
import lodgeFlyer from "@/assets/image-1.jpeg";
import { fetchRoomPackages, fetchRoomTypes, type RoomPackage, type RoomType } from "@/lib/lodge";
import { fetchSiteImage } from "@/lib/content";

const FeaturedTours = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [packages, setPackages] = useState<RoomPackage[]>([]);
  const [managedFlyer, setManagedFlyer] = useState<string | null>(null);
  useEffect(() => {
    void fetchRoomTypes().then(setRooms).catch(() => undefined);
    void fetchRoomPackages().then(setPackages).catch(() => undefined);
    void fetchSiteImage("price_schedule").then(setManagedFlyer).catch(() => undefined);
  }, []);
  const displayedRooms = rooms.map((room) => ({
    title: room.name,
    description: room.description,
    icon: BedDouble,
    packages: packages.filter((pkg) => pkg.room_id === room.id),
  }));
  return <section id="featured-tours" className="safari-section bg-background">
    <div className="safari-container">
      <div className="mb-14 max-w-3xl"><span className="safari-badge mb-4">Rooms</span><h2 className="safari-heading mb-5">Comfortable stays, simple choices</h2><p className="safari-text">Traditional grass-thatched cottages and standard rooms with private balconies, mosquito nets, self-contained bathrooms, and hot showers.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {displayedRooms.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .12 }} className="safari-card p-7">
              <item.icon className="mb-5 text-primary" size={34} /><h3 className="mb-3 font-display text-2xl font-bold">{item.title}</h3>{item.description && <p className="mb-5 text-sm text-muted-foreground">{item.description}</p>}
              {item.packages.length > 0 && <div className="mb-7 space-y-3">{item.packages.map((pkg) => <div key={pkg.id} className="border-b border-border pb-3"><div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-muted-foreground"><Check size={16} className="shrink-0 text-primary" />{pkg.name}</span><strong className="whitespace-nowrap text-xl text-primary">${Number(pkg.price).toFixed(2)}</strong></div>{pkg.offerings.length > 0 && <p className="mt-1 pl-6 text-sm text-muted-foreground">{pkg.offerings.join(" · ")}</p>}</div>)}</div>}
              <Link to="/contact" className="safari-btn-primary w-full">Book {item.title}</Link>
            </motion.article>
          ))}
          <div className="md:col-span-2 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"><p className="flex items-center gap-3"><Utensils className="text-secondary" /> Local and continental dining onsite</p><p className="flex items-center gap-3"><Coffee className="text-secondary" /> Restaurant and bar open to guests</p></div>
        </div>
        {displayedRooms.length === 0 && <p className="rounded-lg bg-muted p-8 text-center text-muted-foreground">Rooms will be published soon.</p>}
        <div className="overflow-hidden rounded-lg bg-primary"><img src={managedFlyer || lodgeFlyer} alt="Dining room at Tembo Safari Lodge" className="h-full w-full object-cover object-center" /></div>
      </div>
      <div className="mt-10 text-center"><Link to="/tours" className="inline-flex items-center gap-2 font-semibold text-primary">See accommodation details <ArrowRight size={18} /></Link></div>
    </div>
  </section>;
};
export default FeaturedTours;
