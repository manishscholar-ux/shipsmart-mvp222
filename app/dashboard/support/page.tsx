"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { MessageCircle, Book, Mail, Phone } from "lucide-react";

const faqs = [
  {
    question: "How do I connect my carrier account?",
    answer:
      "Go to Settings > Carrier Accounts and click 'Connect Another Carrier'. You'll need your carrier account credentials to complete the setup. This allows you to access your negotiated rates.",
  },
  {
    question: "What carriers do you support?",
    answer:
      "We currently support UPS, FedEx, USPS, and DHL. We're continuously adding more carriers based on customer demand.",
  },
  {
    question: "How are shipping rates calculated?",
    answer:
      "Rates are calculated in real-time based on package dimensions, weight, origin, destination, and the specific carrier service selected. Our rate comparison shows you all available options sorted by price.",
  },
  {
    question: "Can I void a label after creating it?",
    answer:
      "Yes, labels can be voided within 24 hours of creation for most carriers. Go to Shipments, find the label, and select 'Void Label' from the actions menu. Refunds are typically processed within 3-5 business days.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Yes! Our Enterprise plan includes custom volume discounts. Contact our sales team to discuss your shipping volume and get a customized pricing plan.",
  },
  {
    question: "How do I schedule a pickup?",
    answer:
      "After creating a label, you can schedule a carrier pickup from the shipment details page. Select your preferred date and time window, and the carrier will come to your location.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with your shipping questions
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Chat with our support team
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              support@shipsmart.com
            </p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Book className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Documentation</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Browse our help center
            </p>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Request</CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Send us a message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input id="subject" placeholder="What do you need help with?" />
              </Field>
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={6}
                />
              </Field>
            </FieldGroup>
            <div className="mt-6">
              <Button className="w-full">Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Support Banner */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Phone className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Need Priority Support?</h3>
              <p className="text-sm text-muted-foreground">
                Pro and Enterprise customers get priority phone support
              </p>
            </div>
          </div>
          <Button variant="outline">Upgrade Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
