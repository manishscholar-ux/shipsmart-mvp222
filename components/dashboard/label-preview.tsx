"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { carriers } from "@/lib/carriers";
import { Separator } from "@/components/ui/separator";

interface SelectedRate {
  carrier?: string;
  service?: string;
  rate?: number;
  estimatedDays?: number;
  name?: string;
  price?: number;
  deliveryDays?: string;
  carrierId?: string;
}

interface LabelPreviewProps {
  selectedRate: SelectedRate | null;
  fromAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  toAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  onCreateLabel: () => void;
  isCreating: boolean;
}

export function LabelPreview({
  selectedRate,
  fromAddress,
  toAddress,
  onCreateLabel,
  isCreating,
}: LabelPreviewProps) {
  const carrier = selectedRate
    ? carriers.find((c) => c.id === (selectedRate.carrier?.toLowerCase() || selectedRate.carrierId))
    : null;

  // Handle both old and new data structures
  const displayService = selectedRate?.service || selectedRate?.name || "Unknown Service";
  const displayPrice = selectedRate?.rate !== undefined ? selectedRate.rate : selectedRate?.price || 0;
  const displayDays = selectedRate?.estimatedDays || (selectedRate?.deliveryDays?.split(" ")[0]) || "3-5 business days";

  if (!selectedRate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Label Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
            <p className="text-muted-foreground">
              Select a shipping rate to preview the label
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Label Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-background p-6">
          {/* Carrier Header */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex h-10 items-center justify-center rounded px-4 text-sm font-bold"
              style={{
                backgroundColor: carrier?.color || "#666",
                color: carrier?.id === "dhl" ? "#000" : "#fff",
              }}
            >
              {carrier?.logo || (selectedRate.carrier?.substring(0, 2) || "XX")}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Service</p>
              <p className="font-semibold text-sm">{displayService}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                From
              </p>
              <p className="font-semibold">{fromAddress.name}</p>
              <p>{fromAddress.address}</p>
              <p>
                {fromAddress.city}, {fromAddress.state} {fromAddress.zip}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                To
              </p>
              <p className="font-semibold">{toAddress.name}</p>
              <p>{toAddress.address}</p>
              <p>
                {toAddress.city}, {toAddress.state} {toAddress.zip}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Barcode placeholder */}
          <div className="flex flex-col items-center py-4">
            <div className="h-16 w-48 bg-foreground rounded-sm" />
            <p className="mt-2 font-mono text-xs">1Z999AA10123456784</p>
          </div>

          {/* Delivery Info */}
          <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Delivery</p>
              <p className="font-semibold">{displayDays} business day{displayDays !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="font-bold text-lg">${displayPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={onCreateLabel}
            disabled={isCreating}
          >
            {isCreating ? "Creating Label..." : "Create & Pay"}
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
