"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { carriers } from "@/lib/carriers";

export function CarrierCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {carriers.map((carrier) => (
        <Card
          key={carrier.id}
          className="relative overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div
                className="flex h-10 w-14 items-center justify-center rounded text-xs font-bold"
                style={{
                  backgroundColor: carrier.color,
                  color: carrier.id === "dhl" ? "#000" : "#fff",
                }}
              >
                {carrier.logo}
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check className="h-3 w-3" />
              </div>
            </div>
            <p className="font-semibold">{carrier.name}</p>
            <Badge variant="outline" className="mt-2 text-xs">
              Connected
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
