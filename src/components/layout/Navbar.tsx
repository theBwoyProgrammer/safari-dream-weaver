import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "The Lodge" },
  { href: "/tours", label: "Accommodation" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Explore" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 py-3 shadow-soft backdrop-blur-md" : "bg-transparent py-5"}`}>
      <div className="safari-container flex items-center justify-between">
        <Link to="/" className="leading-none">
          <span className={`block font-display text-xl font-bold md:text-2xl ${isScrolled ? "text-primary" : "text-primary-foreground"}`}>TEMBO SAFARI LODGE</span>
          <span className="mt-1 block text-xs font-semibold uppercase text-secondary">Queen Elizabeth, Uganda</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className={`text-xs font-semibold uppercase transition-colors hover:text-secondary ${isScrolled ? "text-foreground" : "text-primary-foreground"} ${location.pathname === link.href ? "text-secondary" : ""}`}>{link.label}</Link>
          ))}
          <Button asChild variant="secondary" className="rounded-full px-6"><Link to="/contact">Book your stay</Link></Button>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className={`lg:hidden ${isScrolled ? "text-foreground" : "text-primary-foreground"}`} aria-label="Toggle menu">{isOpen ? <X /> : <Menu />}</Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 border-t border-border bg-background/98 backdrop-blur-md lg:hidden">
            <div className="safari-container space-y-1 py-5">
              {navLinks.map((link) => <Link key={link.href} to={link.href} className="block py-3 text-lg font-semibold text-foreground">{link.label}</Link>)}
              <Button asChild variant="secondary" className="mt-3 w-full rounded-full"><Link to="/contact">Book your stay</Link></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
