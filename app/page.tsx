"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  DollarSign,
  Zap,
  BarChart3,
  Shield,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { carriers } from "@/lib/carriers";

const features = [
  {
    icon: DollarSign,
    title: "Save Up to 90%",
    description:
      "Access discounted commercial rates from all major carriers. No volume commitments required.",
  },
  {
    icon: Zap,
    title: "Instant Rate Comparison",
    description:
      "Compare real-time rates from UPS, FedEx, USPS, and DHL side by side in seconds.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Track your shipping costs, identify savings opportunities, and optimize your operations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and SOC 2 compliance to protect your business data.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "For small businesses just getting started",
    features: [
      "Up to 50 labels/month",
      "All carrier integrations",
      "Basic rate comparison",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses with higher volume",
    features: [
      "Unlimited labels",
      "Priority carrier rates",
      "Advanced analytics",
      "Batch label creation",
      "Priority support",
      "API access",
    ],
    cta: "Start 14-Day Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For high-volume shippers with custom needs",
    features: [
      "Everything in Pro",
      "Custom carrier contracts",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom integrations",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ShipSmart</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#carriers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Carriers
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" variant="outline">
              Trusted by 10,000+ retailers worldwide
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              Ship Smarter,
              <br />
              <span className="text-primary">Save More</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              The all-in-one shipping platform that connects you to UPS, FedEx,
              USPS, and DHL. Compare rates instantly and create labels at up to
              90% off retail prices.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8">
                  Start Shipping Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
              <div>
                <p className="text-3xl font-bold">$2.4M+</p>
                <p className="text-sm text-muted-foreground">Saved by customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1M+</p>
                <p className="text-sm text-muted-foreground">Labels created</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Active businesses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carriers Section */}
      <section id="carriers" className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Connected to All Major Carriers</h2>
            <p className="text-muted-foreground mt-2">
              One platform, all your shipping needs
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {carriers.map((carrier) => (
              <div
                key={carrier.id}
                className="flex h-16 w-24 items-center justify-center rounded-lg text-lg font-bold"
                style={{
                  backgroundColor: carrier.color,
                  color: carrier.id === "dhl" ? "#000" : "#fff",
                }}
              >
                {carrier.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to ship efficiently
            </h2>
            <p className="mt-4 text-muted-foreground">
              Powerful tools designed for modern retailers and e-commerce
              businesses.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Create a label in 3 simple steps
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">Enter Details</h3>
              <p className="mt-2 text-muted-foreground">
                Add your shipment details including addresses and package
                dimensions.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">Compare Rates</h3>
              <p className="mt-2 text-muted-foreground">
                View real-time rates from all carriers sorted by price and
                delivery speed.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">Print & Ship</h3>
              <p className="mt-2 text-muted-foreground">
                Purchase and print your label instantly. Drop off or schedule a
                pickup.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button size="lg">
                Try It Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4" variant="outline">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start free, upgrade when you need to. No hidden fees.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? "border-primary shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard" className="block mt-8">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-sidebar py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-sidebar-foreground md:text-4xl">
            Ready to ship smarter?
          </h2>
          <p className="mt-4 text-sidebar-foreground/70 max-w-2xl mx-auto">
            Join thousands of businesses saving time and money on every
            shipment. Start free, no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Truck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ShipSmart</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API Docs
              </a>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 ShipSmart. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
