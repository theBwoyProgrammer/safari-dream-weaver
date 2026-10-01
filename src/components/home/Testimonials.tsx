import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const reviews = [
	{ quote: "The boat cruise is something you should not miss. Its therapeutic.", name: "Dennis A", date: "Visited Dec 2025" },
	{ quote: "Come here and enjoy the boat cruise on the two lakes. Its therapeutic.", name: "Dennis A", date: "Visited Dec 2025" },
	{ quote: "There are mosquito nets in rooms and also kettles. Very considerate.", name: "Juliette G", date: "Visited Oct 2025" },
	{ quote: "Cottages away from the bridge are better.", name: "Shirin B", date: "Visited Dec 2023" },
	{ quote: "Walk distance from boat ride on Kazinga Channel and 20 m from Safari Game Drive.", name: "Marta", date: "Visited Aug 2022" },
	{ quote: "Go for the cottage if you can - incredible and you have a veranda over the river!", name: "Alextheleopard", date: "Visited Mar 2018" },
	{ quote: "Bring your own tent for the best views! This place was incredible. But watch out for the hippos at night.", name: "Megan Jamer", date: "Visited Apr 2017" },
	{ quote: "All good! Fan and shower worked, bed comfortable, secure.", name: "yehudah", date: "Visited Dec 2013" },
];

const Testimonials = () => <section className="safari-section bg-primary text-primary-foreground"><div className="safari-container"><div className="mb-12 max-w-3xl"><span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-semibold uppercase text-secondary"><Star size={15} fill="currentColor" /> Guest reviews</span><h2 className="mb-5 font-display text-4xl font-bold md:text-5xl">Good days stay with you</h2><p className="text-lg text-primary-foreground/80">A few words from guests who made Tembo their base beside the Kazinga Channel.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reviews.map((review,index)=><motion.article key={`${review.name}-${index}`} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.07}} className="flex flex-col border-t border-primary-foreground/25 pt-6"><Quote className="mb-5 text-secondary" size={26} /><p className="mb-7 text-lg leading-relaxed text-primary-foreground/90">“{review.quote}”</p><div className="mt-auto"><p className="font-semibold">{review.name}</p><p className="text-sm text-primary-foreground/60">{review.date}</p></div></motion.article>)}</div></div></section>;
export default Testimonials;
