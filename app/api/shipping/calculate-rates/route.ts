import { NextRequest, NextResponse } from "next/server";
import { getFedExRates } from "@/lib/fedex-service";

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

// Mock rates for other carriers (fallback)
function getMockRates(params: RateRequest): ShippingRate[] {
  const { weight, length = 12, width = 8, height = 6 } = params;

  const baseRates: Record<string, number> = {
    "USPS Ground Advantage": 3.99 + weight * 0.15,
    "USPS Priority Mail": 7.99 + weight * 0.35,
    "USPS Priority Express": 24.99 + weight * 0.15,
    "UPS Ground": 8.99 + weight * 0.45,
    "UPS 3-Day Select": 15.99 + weight * 0.5,
    "UPS 2nd Day Air": 22.99 + weight * 0.65,
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
    "Express": 1,
  };

  for (const [key, days] of Object.entries(estimates)) {
    if (service.includes(key)) return days;
  }
  return 5;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RateRequest;

    // Get FedEx real rates
    let fedexRates: ShippingRate[] = [];
    try {
      fedexRates = await getFedExRates(
        body.fromZip,
        body.toZip,
        body.weight,
        body.length,
        body.width,
        body.height
      );
    } catch (error) {
      console.error("Error fetching FedEx rates:", error);
      // Fallback to mock FedEx rates if API fails
      fedexRates = getMockRates(body).filter((r) => r.carrier === "FedEx");
    }

    // Get mock rates for other carriers
    const mockRates = getMockRates(body).filter((r) => r.carrier !== "FedEx");

    // Combine all rates
    const allRates = [...fedexRates, ...mockRates];

    // Sort by price (ascending)
    allRates.sort((a, b) => a.rate - b.rate);

    return NextResponse.json({
      rates: allRates,
      bestRate: allRates[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Calculate rates error:", error);
    return NextResponse.json(
      { error: "Failed to calculate rates" },
      { status: 500 }
    );
  }
}
