import { motion } from "framer-motion";
import { Bird, Car, MapPin, Plane, Utensils, Waves, BedDouble } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/home/CallToAction";
import lodgeAerial from "@/assets/image-3.jpeg";
import cottageImage from "@/assets/image-5.jpeg";
import sunsetImage from "@/assets/image-6.jpeg";
import diningImage from "@/assets/image-7.jpeg";

const features = [
  { icon: BedDouble, title: "A place to return to", text: "Traditional grass-thatched cottages and standard rooms, with private balconies, mosquito nets, self-contained bathrooms, and hot showers." },
  { icon: Waves, title: "The channel, close by", text: "The Kazinga Channel lies just 300 metres away, placing water, birdlife, and the rhythms of the park within the lodge landscape." },
  { icon: Utensils, title: "A warm meal at day's end", text: "Return from the game tracks to local and continental dishes in the lodge restaurant, with a bar open to guests." },
  { icon: Bird, title: "Days shaped by the wild", text: "Plan boat cruises, guided game drives, nature walks, bird watching, biking, and fishing tours from Katunguru." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <section className="relative flex min-h-[76vh] items-end overflow-hidden bg-primary text-primary-foreground">
        <img src={lodgeAerial} alt="Tembo Safari Lodge beside the Kazinga Channel" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 safari-overlay" />
        <div className="safari-container relative z-10 w-full pb-20 pt-36 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <span className="mb-6 inline-block text-sm font-semibold uppercase text-secondary">The Tembo story</span>
            <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">A place between the journey and the wild.</h1>
            <p className="max-w-2xl text-xl leading-relaxed text-primary-foreground/90">Tembo is a home base for discovering Queen Elizabeth National Park, with the Kazinga Channel woven into the view and the next adventure never far away.</p>
          </motion.div>
        </div>
      </section>

      <section className="safari-section bg-background">
        <div className="safari-container grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="safari-badge mb-5">Why Tembo exists</span>
            <h2 className="safari-heading mb-7">More than the moment you see an animal</h2>
            <div className="space-y-5 safari-text">
              <p>A safari is also the road through Uganda. The first light over the savannah. The sound of hippos from the water. The conversations after a long game drive.</p>
              <p>It is the meal you remember, the people who welcomed you, and the quiet hour when there is nowhere else you need to be.</p>
              <p>Tembo Safari Lodge was created to give travellers a comfortable place from which to experience those moments—close to the wilderness, connected to the channel, and ready for whatever the next day brings.</p>
            </div>
            <p className="mt-8 border-l-2 border-secondary pl-6 font-display text-2xl font-bold text-primary">Come for the safari. Stay for the feeling of being here.</p>
          </motion.div>
          <motion.figure initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-lg shadow-dramatic">
            <img src={sunsetImage} alt="Sunset over the Kazinga Channel from Tembo Safari Lodge" className="aspect-[4/5] w-full object-cover md:aspect-[5/4]" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-primary/90 px-6 py-4 text-sm text-primary-foreground">When the tracks grow quiet, the evening settles over Katunguru.</figcaption>
          </motion.figure>
        </div>
      </section>

      <section className="safari-section bg-muted">
        <div className="safari-container">
          <div className="mb-12 max-w-3xl">
            <span className="safari-badge mb-5">Life at the lodge</span>
            <h2 className="safari-heading mb-6">The rhythm of a day at Tembo</h2>
            <p className="safari-text">Leave early for the park, return to a quiet room and a warm meal, then watch the last light move across the channel landscape.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => (
              <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border-t-2 border-secondary bg-card p-7 shadow-soft">
                <item.icon className="mb-5 text-primary" size={32} />
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="safari-section bg-primary text-primary-foreground">
        <div className="safari-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="grid grid-cols-2 gap-3">
            <img src={cottageImage} alt="A cottage at Tembo Safari Lodge" className="h-full min-h-80 w-full rounded-lg object-cover" />
            <img src={diningImage} alt="Dining room overlooking the channel at Tembo Safari Lodge" className="mt-10 h-full min-h-80 w-full rounded-lg object-cover" />
          </div>
          <div>
            <span className="mb-5 inline-block text-sm font-semibold uppercase text-secondary">Hospitality, naturally</span>
            <h2 className="mb-7 font-display text-4xl font-bold md:text-5xl">The lodge is part of the safari.</h2>
            <div className="space-y-5 text-lg leading-relaxed text-primary-foreground/80">
              <p>Here, rest is not separate from the journey. It is the pause between an early start and an afternoon on the water; between the dust of the game tracks and dinner overlooking the landscape.</p>
              <p>The setting is simple and grounded in place: cottages among the greenery, tables ready for a shared meal, and the channel close enough to shape the mood of every day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="safari-section bg-background">
        <div className="safari-container">
          <div className="mb-12 max-w-2xl">
            <span className="safari-badge mb-4">Getting here</span>
            <h2 className="safari-heading mb-5">Follow the road to Katunguru</h2>
            <p className="safari-text">Find Tembo off the Ntungamo–Katunguru Road, inside Queen Elizabeth National Park.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-t-2 border-secondary pt-6"><MapPin className="mb-4 text-primary" /><h3 className="mb-2 text-xl font-bold">In the park</h3><p className="text-muted-foreground">Katunguru, Queen Elizabeth National Park, Uganda—just 300 metres from the Kazinga Channel.</p></div>
            <div className="border-t-2 border-secondary pt-6"><Car className="mb-4 text-primary" /><h3 className="mb-2 text-xl font-bold">By road</h3><p className="text-muted-foreground">About 5–6 hours (384 km) from Kampala via Mbarara and Bushenyi.</p></div>
            <div className="border-t-2 border-secondary pt-6"><Plane className="mb-4 text-primary" /><h3 className="mb-2 text-xl font-bold">By air</h3><p className="text-muted-foreground">About 1 hour from Entebbe to Kasese Airstrip, followed by a short transfer.</p></div>
          </div>
        </div>
      </section>
      <CallToAction />
    </main>
    <Footer />
  </div>
);

export default About;