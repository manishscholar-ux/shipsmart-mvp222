import { NextRequest, NextResponse } from "next/server";

interface RateRequest {
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  fromZip: string;
  toZip: string;
  isInternational: boolean;
}

interface ShippingRate {
  carrier: string;
  service: string;
  rate: number;
  estimatedDays: number;
  currency: string;
}

// Mock rates for all carriers
function getMockRates(params: RateRequest): ShippingRate[] {
  const { weight, length = 12, width = 8, height = 6 } = params;

  const baseRates: Record<string, number> = {
    "USPS Ground Advantage": 3.99 + weight * 0.15,
    "USPS Priority Mail": 7.99 + weight * 0.35,
    "USPS Priority Express": 24.99 + weight * 0.15,
    "UPS Ground": 8.99 + weight * 0.45,
    "UPS 3-Day Select": 15.99 + weight * 0.5,
    "UPS 2nd Day Air": 22.99 + weight * 0.65,
    "FedEx Ground": 9.49 + weight * 0.5,
    "FedEx Express Saver": 18.99 + weight * 0.7,
    "FedEx 2Day": 24.99 + weight * 0.85,
    "DHL Express": 28.99 + weight * 0.75,
    "DHL Parcel Ground": 10.99 + weight * 0.4,
  };

  const volume = (length * width * height) / 166;
  const billableWeight = Math.max(weight, volume);

  const rates = Object.entries(baseRates).map(([service, baseRate]) => ({
    carrier: service.split(" ")[0],
    service,
    rate: Number((baseRate * (billableWeight / weight)).toFixed(2)),
    estimatedDays: getEstimatedDays(service),
    currency: "USD",
  }));

  return rates;
}

function getEstimatedDays(service: string): number {
  const estimates: Record<string, number> = {
    "Ground Advantage": 5,
    "Priority Mail": 3,
    "Priority Express": 1,
    "Ground": 5,
    "3-Day Select": 3,
    "2nd Day Air": 2,
    "Express Saver": 5,
    "2Day": 2,
    "Express": 1,
    "Parcel Ground": 5,
  };

  for (const [key, days] of Object.entries(estimates)) {
    if (service.includes(key)) return days;
  }
  return 5;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RateRequest;

    console.log("[Rates API] Request - From:", body.fromZip, "To:", body.toZip, "Weight:", body.weight);

    // Get mock rates for all carriers
    const rates = getMockRates(body);

    // Sort by price (ascending)
    rates.sort((a, b) => a.rate - b.rate);

    console.log("[Rates API] Returning", rates.length, "rates");

    return NextResponse.json({
      rates: rates,
      bestRate: rates[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Rates API] Error:", error);
    return NextResponse.json(
      { error: "Failed to calculate rates" },
      { status: 500 }
    );
  }
}
