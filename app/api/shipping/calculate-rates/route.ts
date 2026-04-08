import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface RateRequest {
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  fromZip: string;
  toZip: string;
  isInternational: boolean;
}

// Simplified rate calculation - in production, call actual carrier APIs
function calculateRates(params: RateRequest) {
  const { weight, length = 12, width = 8, height = 6, isInternational } = params;
  
  // Base rates per lb
  const baseRates: Record<string, number> = {
    "USPS Ground Advantage": 3.99 + (weight * 0.15),
    "USPS Priority Mail": 7.99 + (weight * 0.35),
    "USPS Priority Express": 24.99 + (weight * 0.15),
    "UPS Ground": 8.99 + (weight * 0.45),
    "UPS 3-Day Select": 15.99 + (weight * 0.50),
    "UPS 2nd Day Air": 22.99 + (weight * 0.65),
    "FedEx Ground": 9.49 + (weight * 0.50),
    "FedEx Express Saver": 18.99 + (weight * 0.70),
    "FedEx 2Day": 24.99 + (weight * 0.85),
    "DHL Express": 28.99 + (weight * 0.75),
    "DHL Parcel Ground": 10.99 + (weight * 0.40)
  };

  // Dimensional weight adjustment
  const volume = (length * width * height) / 166; // DIM divisor
  const billableWeight = Math.max(weight, volume);
  
  // Apply adjustments based on billable weight
  const rates = Object.entries(baseRates).map(([service, baseRate]) => ({
    carrier: service.split(" ")[0],
    service,
    rate: Number((baseRate * (billableWeight / weight)).toFixed(2)),
    estimatedDays: getEstimatedDays(service),
    currency: "USD"
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
    "Parcel Ground": 5
  };

  for (const [key, days] of Object.entries(estimates)) {
    if (service.includes(key)) return days;
  }
  return 5;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as RateRequest;
    
    const rates = calculateRates(body);
    
    // Sort by price (ascending)
    rates.sort((a, b) => a.rate - b.rate);

    return NextResponse.json({
      rates,
      bestRate: rates[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Calculate rates error:", error);
    return NextResponse.json(
      { error: "Failed to calculate rates" },
      { status: 500 }
    );
  }
}
