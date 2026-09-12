import { Link } from 'react-router-dom';
import {
  MapPin, Zap, Navigation, Package, Check, ArrowRight, Smartphone, Link2, Share2, Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]">
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DropLink</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Zap className="h-3.5 w-3.5" />
              No app needed for customers — just a link
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
              Stop calling customers for directions.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Send one link. Your customer shares their exact location. You navigate straight there.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
              {[
                { icon: Package, label: 'Create delivery', color: 'bg-blue-100 text-blue-600' },
                { icon: Link2, label: 'Send link', color: 'bg-indigo-100 text-indigo-600' },
                { icon: Share2, label: 'Customer shares location', color: 'bg-green-100 text-green-600' },
                { icon: Navigation, label: 'Open in Maps', color: 'bg-orange-100 text-orange-600' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 md:flex-col">
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold">{step.label}</span>
                  </div>
                  {i < 3 && <ArrowRight className="h-5 w-5 text-muted-foreground md:rotate-90" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Built for delivery drivers</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to find your customers faster.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, title: 'Exact location', desc: 'No more guessing where customers are.', color: 'bg-blue-50 text-blue-600' },
            { icon: Zap, title: 'One-tap sharing', desc: "Customer doesn't need an account or app.", color: 'bg-green-50 text-green-600' },
            { icon: Navigation, title: 'Open in Maps', desc: 'Navigate directly to the customer.', color: 'bg-orange-50 text-orange-600' },
            { icon: Package, title: 'Delivery history', desc: 'Keep track of your deliveries.', color: 'bg-indigo-50 text-indigo-600' },
          ].map((card, i) => (
            <Card key={i} className="border-border/60 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold">{card.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold">Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">For occasional deliveries.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {['5 deliveries per month', 'Location sharing', 'Open in Google Maps'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-8 block">
                <Button variant="outline" className="w-full">Get started</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-primary shadow-md ring-1 ring-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Pro</h3>
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">Popular</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">For active drivers.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {['Unlimited deliveries', 'Delivery history', 'Statistics', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-8 block">
                <Button className="w-full">Start free trial</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-16 text-white">
          <Smartphone className="mx-auto h-12 w-12 opacity-80" />
          <h2 className="mt-6 text-3xl font-bold">No phone calls. No directions. Just send a link.</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Join delivery drivers who save time on every delivery.
          </p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="gap-2">
              Get started — it's free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">DropLink</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 DropLink. Built for delivery drivers.</p>
        </div>
      </footer>
    </div>
  );
}
