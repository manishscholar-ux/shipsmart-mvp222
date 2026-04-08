"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type ShipmentDetails } from "@/lib/carriers";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface ShippingFormProps {
  shipmentDetails: ShipmentDetails;
  onChange: (details: ShipmentDetails) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function ShippingForm({
  shipmentDetails,
  onChange,
  onCalculate,
  isCalculating,
}: ShippingFormProps) {
  const updateField = (field: keyof ShipmentDetails, value: string) => {
    onChange({
      ...shipmentDetails,
      [field]: field === "fromZip" || field === "toZip" ? value : parseFloat(value) || 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
            From Address
          </h3>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fromZip">ZIP Code</FieldLabel>
              <Input
                id="fromZip"
                placeholder="e.g., 90210"
                value={shipmentDetails.fromZip}
                onChange={(e) => updateField("fromZip", e.target.value)}
              />
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
            To Address
          </h3>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="toZip">ZIP Code</FieldLabel>
              <Input
                id="toZip"
                placeholder="e.g., 10001"
                value={shipmentDetails.toZip}
                onChange={(e) => updateField("toZip", e.target.value)}
              />
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Package Details
          </h3>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="weight">Weight (lbs)</FieldLabel>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={shipmentDetails.weight || ""}
                onChange={(e) => updateField("weight", e.target.value)}
              />
            </Field>
          </FieldGroup>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Field>
              <FieldLabel htmlFor="length">Length (in)</FieldLabel>
              <Input
                id="length"
                type="number"
                placeholder="0"
                value={shipmentDetails.length || ""}
                onChange={(e) => updateField("length", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="width">Width (in)</FieldLabel>
              <Input
                id="width"
                type="number"
                placeholder="0"
                value={shipmentDetails.width || ""}
                onChange={(e) => updateField("width", e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="height">Height (in)</FieldLabel>
              <Input
                id="height"
                type="number"
                placeholder="0"
                value={shipmentDetails.height || ""}
                onChange={(e) => updateField("height", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={onCalculate}
          disabled={
            isCalculating ||
            !shipmentDetails.fromZip ||
            !shipmentDetails.toZip ||
            !shipmentDetails.weight
          }
        >
          {isCalculating ? "Calculating Rates..." : "Compare Rates"}
        </Button>
      </CardContent>
    </Card>
  );
}
