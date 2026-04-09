interface FedExRate {
  carrier: string;
  service: string;
  rate: number;
  estimatedDays: number;
  currency: string;
}

interface FedExAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FedExRateReply {
  output?: {
    rateReplyDetails?: Array<{
      serviceType: string;
      totalNetCharge: number;
      minimumCharges: number;
      transactionShipDate: string;
      pickupType: string;
      dayOfWeek: string;
      deliveryDate?: string;
      businessDaysInTransit?: number;
    }>;
  };
}

async function getFedExAuthToken(): Promise<string> {
  const apiKey = process.env.FEDEX_API_KEY;
  const apiSecret = process.env.FEDEX_API_SECRET;
  const apiUrl = process.env.FEDEX_API_URL || "https://apis-sandbox.fedex.com";

  if (!apiKey || !apiSecret) {
    throw new Error("FedEx API credentials not configured");
  }

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const response = await fetch(`${apiUrl}/oauth/authorize`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("FedEx OAuth error:", error);
      throw new Error(`FedEx OAuth failed: ${response.status}`);
    }

    const data: FedExAuthToken = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to get FedEx auth token:", error);
    throw error;
  }
}

export async function getFedExRates(
  fromZip: string,
  toZip: string,
  weight: number,
  length: number = 12,
  width: number = 8,
  height: number = 6
): Promise<FedExRate[]> {
  const accountNumber = process.env.FEDEX_ACCOUNT_NUMBER;
  const apiUrl = process.env.FEDEX_API_URL || "https://apis-sandbox.fedex.com";

  if (!accountNumber) {
    throw new Error("FedEx account number not configured");
  }

  try {
    const token = await getFedExAuthToken();

    const requestPayload = {
      accountNumber: {
        value: accountNumber,
      },
      requestedShipment: {
        shipper: {
          address: {
            postalCode: fromZip,
            countryCode: "US",
          },
        },
        recipient: {
          address: {
            postalCode: toZip,
            countryCode: "US",
          },
        },
        pickupType: "STANDARD",
        requestedPackageLineItems: [
          {
            weight: {
              units: "LB",
              value: weight,
            },
            dimensions: {
              length: length,
              width: width,
              height: height,
              units: "IN",
            },
          },
        ],
      },
    };

    const response = await fetch(`${apiUrl}/rate/v1/rates/quote`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-locale": "en_US",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("FedEx Rate API error:", error);
      throw new Error(`FedEx Rate API failed: ${response.status}`);
    }

    const data: FedExRateReply = await response.json();

    if (!data.output?.rateReplyDetails || data.output.rateReplyDetails.length === 0) {
      console.warn("No rates returned from FedEx API");
      return [];
    }

    const rates: FedExRate[] = data.output.rateReplyDetails.map((detail) => {
      return {
        carrier: "FedEx",
        service: `FedEx ${detail.serviceType.replace(/_/g, " ")}`,
        rate: Number(detail.totalNetCharge.toFixed(2)),
        estimatedDays: detail.businessDaysInTransit || getEstimatedDaysFromService(detail.serviceType),
        currency: "USD",
      };
    });

    return rates;
  } catch (error) {
    console.error("Failed to get FedEx rates:", error);
    // Return empty array on error - will be handled by fallback in route handler
    return [];
  }
}

function getEstimatedDaysFromService(serviceType: string): number {
  const estimates: Record<string, number> = {
    FEDEX_EXPRESS_SAVER: 5,
    FEDEX_2_DAY: 2,
    FEDEX_NEXT_DAY_AIR: 1,
    FEDEX_NEXT_DAY_AIR_AM: 1,
    FEDEX_GROUND: 5,
  };

  return estimates[serviceType] || 5;
}
