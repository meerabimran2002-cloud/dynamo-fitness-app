import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dumbbell,
  HeartPulse,
  Users,
  Salad,
  Flame,
  Sparkles,
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import trainer1 from "@/assets/trainer1.jpg";
import trainer2 from "@/assets/trainer2.jpg";
import trainer3 from "@/assets/trainer3.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IRON PULSE — Premium Gym in the Heart of the City" },
      {
        name: "description",
        content:
          "Strength, cardio, yoga and expert coaching. Flexible membership plans, elite trainers and a 24/7 training floor at Iron Pulse.",
      },
      { property: "og:title", content: "IRON PULSE — Premium Gym & Fitness Club" },
      {
        property: "og:description",
        content: "Train harder. Elite trainers, modern equipment and plans that fit your goals.",
      },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Dumbbell, title: "Weight Training", text: "Free weights, racks and pro machines." },
  { icon: HeartPulse, title: "Cardio Zone", text: "Treadmills, bikes and HIIT circuits." },
  { icon: Flame, title: "Personal Training", text: "One-on-one coaching built for you." },
  { icon: Sparkles, title: "Yoga & Mobility", text: "Recover, stretch, breathe, repeat." },
  { icon: Salad, title: "Diet Plans", text: "Nutrition mapped to your body type." },
  { icon: Users, title: "Group Classes", text: "High-energy sessions, every evening." },
];

const trainers = [
  { img: trainer1, name: "Adam Cole", role: "Head Strength Coach" },
  { img: trainer2, name: "Sara Malik", role: "Cardio & Yoga Expert" },
  { img: trainer3, name: "Bilal Khan", role: "Bodybuilding Specialist" },
];

const gallery = [gallery1, gallery2, gallery3, gallery4];

const testimonials = [
  { name: "Hamza R.", text: "Lost 14kg in 5 months. The coaching here is on another level." },
  { name: "Ayesha K.", text: "Clean, modern and never crowded. Group classes are addictive." },
  { name: "Daniyal S.", text: "Best equipment in the city and the diet plan actually works." },
];

const stats = [
  { value: "500+", label: "Active Members" },
  { value: "10+", label: "Expert Trainers" },
  { value: "24/7", label: "Open Access" },
  { value: "15", label: "Weekly Classes" },
];

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  is_popular: boolean;
};

function Index() {
  const { user } = useSession();
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: async (): Promise<Plan[]> => {
      const { data, error } = await supabase
        .from("plans")
        .select("id,name,price,period,features,is_popular")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Plan[];
    },
  });

  async function joinPlan(planId: string) {
    if (!user) {
      toast.error("Please create an account first to join a plan.");
      return;
    }
    setJoining(planId);
    const { error } = await supabase.from("bookings").insert({ user_id: user.id, plan_id: planId });
    setJoining(null);
    if (error) toast.error(error.message);
    else toast.success("Request sent! Our team will confirm your membership shortly.");
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(contact);
    setSending(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Message sent. We'll get back to you soon!");
      setContact({ name: "", email: "", message: "" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Athlete lifting a barbell at Iron Pulse gym"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-32 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-secondary backdrop-blur">
            <Flame className="size-3.5" /> No excuses. Only reps.
          </p>
          <h1 className="max-w-3xl font-display text-6xl uppercase sm:text-7xl lg:text-8xl">
            Build the body <br />
            <span className="text-fire">you deserve</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
            Elite trainers. Modern equipment. A training floor that never sleeps.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-fire px-8 font-display text-lg tracking-wider uppercase shadow-[var(--shadow-glow)]"
            >
              <Link to="/auth">Join Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-secondary px-8 font-display text-lg tracking-wider uppercase text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <a href="#plans">See Plans</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={aboutImg}
              alt="Iron Pulse gym floor"
              loading="lazy"
              width={1200}
              height={900}
              className="w-full rounded-3xl border border-border object-cover shadow-[var(--shadow-card)]"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">About us</p>
            <h2 className="mt-3 font-display text-5xl uppercase lg:text-6xl">
              More than a gym. <span className="text-fire">A movement.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Since 2016 we've helped hundreds of people rebuild their strength, confidence and
              routine — with coaching that actually sticks.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-5 card-glow"
                >
                  <p className="font-display text-4xl text-fire">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-y border-border bg-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHead kicker="What we offer" title="Train your way" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="group h-full rounded-3xl border border-border bg-card p-7 card-glow">
                  <span className="grid size-12 place-items-center rounded-2xl bg-fire">
                    <s.icon className="size-6 text-primary-foreground" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl uppercase">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section id="trainers" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHead kicker="The team" title="Meet your coaches" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="group relative overflow-hidden rounded-3xl border border-border bg-card card-glow">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6">
                  <h3 className="font-display text-3xl uppercase">{t.name}</h3>
                  <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                    {t.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="border-y border-border bg-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHead kicker="Inside the club" title="Our gallery" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((g, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="overflow-hidden rounded-3xl border border-border">
                  <img
                    src={g}
                    alt={`Iron Pulse gym photo ${i + 1}`}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionHead kicker="Membership" title="Pick your plan" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {(plans ?? []).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border bg-card p-8 card-glow ${
                  p.is_popular ? "border-primary" : "border-border"
                }`}
              >
                {p.is_popular && (
                  <span className="absolute -top-3 left-8 rounded-full bg-fire px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-3xl uppercase">{p.name}</h3>
                <p className="mt-3">
                  <span className="font-display text-5xl text-fire">
                    Rs {Number(p.price).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground"> /{p.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-secondary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => joinPlan(p.id)}
                  disabled={joining === p.id}
                  className={`mt-8 rounded-full font-display text-lg uppercase tracking-wider ${
                    p.is_popular ? "bg-fire" : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {joining === p.id ? "Sending..." : "Join this plan"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-surface/40 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHead kicker="Real results" title="Member stories" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="h-full rounded-3xl border border-border bg-card p-7 card-glow">
                  <div className="flex gap-1 text-secondary">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground">"{t.text}"</p>
                  <p className="mt-5 font-display text-xl uppercase">{t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHead kicker="Get in touch" title="Come train with us" align="left" />
            <div className="mt-8 space-y-4">
              <InfoRow icon={MapPin} text="42 Iron Street, Gulberg III, Lahore" />
              <InfoRow icon={Phone} text="+92 300 1234567" />
              <InfoRow icon={Mail} text="hello@ironpulse.fit" />
            </div>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#contact"
                  aria-label="Social link"
                  className="grid size-11 place-items-center rounded-2xl border border-border bg-card transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={sendMessage}
              className="space-y-4 rounded-3xl border border-border bg-card p-7"
            >
              <Input
                required
                placeholder="Your name"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="h-12 rounded-xl bg-input"
              />
              <Input
                required
                type="email"
                placeholder="Email address"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="h-12 rounded-xl bg-input"
              />
              <Textarea
                required
                rows={5}
                placeholder="How can we help?"
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                className="rounded-xl bg-input"
              />
              <Button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-fire font-display text-lg uppercase tracking-wider"
              >
                {sending ? "Sending..." : "Send message"}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border bg-surface/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 text-center lg:px-8">
          <span className="font-display text-2xl tracking-wider">
            IRON <span className="text-fire">PULSE</span>
          </span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Iron Pulse Fitness Club. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  align = "center",
}: {
  kicker: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{kicker}</p>
      <h2 className="mt-3 font-display text-5xl uppercase lg:text-6xl">{title}</h2>
    </div>
  );
}

function InfoRow({ icon: Icon, text }: { icon: typeof MapPin; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-card">
        <Icon className="size-5 text-secondary" />
      </span>
      <span className="min-w-0 text-muted-foreground">{text}</span>
    </div>
  );
}

