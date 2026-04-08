"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Download, Check, Zap } from "lucide-react";

const invoices = [
  {
    id: "INV-001",
    date: "Mar 1, 2024",
    amount: 156.42,
    status: "paid",
    labels: 47,
  },
  {
    id: "INV-002",
    date: "Feb 1, 2024",
    amount: 203.18,
    status: "paid",
    labels: 62,
  },
  {
    id: "INV-003",
    date: "Jan 1, 2024",
    amount: 89.55,
    status: "paid",
    labels: 28,
  },
  {
    id: "INV-004",
    date: "Dec 1, 2023",
    amount: 312.76,
    status: "paid",
    labels: 95,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view invoices
        </p>
      </div>

      {/* Current Plan */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your subscription details and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">Pro Plan</h3>
                  <Badge className="bg-primary text-primary-foreground">
                    Active
                  </Badge>
                </div>
                <p className="text-muted-foreground">$29/month</p>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Labels this month</span>
                <span className="font-medium">47 / Unlimited</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                Unlimited labels
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                Priority rates
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                API access
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Manage your payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-14 items-center justify-center rounded bg-foreground text-background">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">
                    Expires 12/2025
                  </p>
                </div>
              </div>
              <Badge variant="outline">Default</Badge>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Update Card
              </Button>
              <Button variant="outline" className="flex-1">
                Add New Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">$0.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">$156.42</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-2xl font-bold text-success">$2,456.80</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Next Invoice</p>
            <p className="text-2xl font-bold">Apr 1, 2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Your billing history and downloadable invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.labels}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-success text-success bg-success/10">
                        <Check className="mr-1 h-3 w-3" />
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Upgrade to Enterprise</h3>
              <p className="text-sm text-muted-foreground">
                Get custom carrier contracts and dedicated support
              </p>
            </div>
          </div>
          <Button>Contact Sales</Button>
        </CardContent>
      </Card>
    </div>
  );
}
