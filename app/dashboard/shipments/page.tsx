"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ExternalLink, MapPin } from "lucide-react";
import { carriers } from "@/lib/carriers";

const shipments = [
  {
    id: "1",
    trackingNumber: "1Z999AA10123456784",
    carrier: "ups",
    service: "UPS Ground",
    status: "in_transit",
    destination: "Los Angeles, CA",
    estimatedDelivery: "Mar 18, 2024",
    lastUpdate: "Package departed facility in Phoenix, AZ",
  },
  {
    id: "2",
    trackingNumber: "794644790132",
    carrier: "fedex",
    service: "FedEx 2Day",
    status: "out_for_delivery",
    destination: "New York, NY",
    estimatedDelivery: "Mar 16, 2024",
    lastUpdate: "Out for delivery",
  },
  {
    id: "3",
    trackingNumber: "9400111899223003456123",
    carrier: "usps",
    service: "Priority Mail",
    status: "delivered",
    destination: "Chicago, IL",
    estimatedDelivery: "Mar 15, 2024",
    lastUpdate: "Delivered, left at front door",
  },
  {
    id: "4",
    trackingNumber: "1234567890",
    carrier: "dhl",
    service: "DHL Express",
    status: "in_transit",
    destination: "Houston, TX",
    estimatedDelivery: "Mar 17, 2024",
    lastUpdate: "Package in transit to destination",
  },
];

export default function ShipmentsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_transit":
        return (
          <Badge variant="outline" className="border-primary text-primary bg-primary/10">
            In Transit
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="border-success text-success bg-success/10">
            Delivered
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCarrier = (carrierId: string) =>
    carriers.find((c) => c.id === carrierId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Track and manage all your active shipments
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Transit</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Out for Delivery</p>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Delivered Today</p>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Exceptions</p>
            <p className="text-2xl font-bold text-destructive">1</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>
                All shipments from the last 30 days
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by tracking number..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Delivery</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => {
                  const carrier = getCarrier(shipment.carrier);
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-8 w-10 items-center justify-center rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: carrier?.color || "#666",
                              color: carrier?.id === "dhl" ? "#000" : "#fff",
                            }}
                          >
                            {carrier?.logo}
                          </div>
                          <span className="text-sm">{shipment.service}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {shipment.trackingNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {shipment.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {getStatusBadge(shipment.status)}
                          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                            {shipment.lastUpdate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.estimatedDelivery}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
