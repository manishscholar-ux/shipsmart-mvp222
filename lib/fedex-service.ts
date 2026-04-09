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
      totalNetCharge?: number;
      minimumCharges?: number;
      transactionShipDate?: string;
      pickupType?: string;
      dayOfWeek?: string;
      deliveryDate?: string;
      businessDaysInTransit?: number;
    }>;
  };
  errors?: Array<{ message: string; code: string }>;
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
    console.log("[FedEx] Requesting auth token...");
    const response = await fetch(`${apiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const responseText = await response.text();
    console.log(`[FedEx] Auth response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[FedEx] Auth error response:`, responseText);
      throw new Error(`FedEx OAuth failed: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText) as FedExAuthToken;
    if (!data.access_token) {
      throw new Error("No access token in FedEx response");
    }
    console.log("[FedEx] Auth successful");
    return data.access_token;
  } catch (error) {
    console.error("[FedEx] Auth token error:", error);
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
    console.log("[FedEx] Getting auth token...");
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

    console.log("[FedEx] Requesting rates...");
    const response = await fetch(`${apiUrl}/rate/v1/rates/quote`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-locale": "en_US",
      },
      body: JSON.stringify(requestPayload),
    });

    const responseText = await response.text();
    console.log(`[FedEx] Rate response status: ${response.status}`);
    console.log(`[FedEx] Rate response:`, responseText.substring(0, 500));

    if (!response.ok) {
      console.error(`[FedEx] Rate API error response:`, responseText);
      throw new Error(`FedEx Rate API failed: ${response.status}`);
    }

    const data: FedExRateReply = JSON.parse(responseText);

    // Check for API errors in response
    if (data.errors && data.errors.length > 0) {
      console.error("[FedEx] API returned errors:", data.errors);
      throw new Error(`FedEx API error: ${data.errors[0].message}`);
    }

    if (!data.output?.rateReplyDetails || data.output.rateReplyDetails.length === 0) {
      console.warn("[FedEx] No rates returned from API");
      return [];
    }

    const rates: FedExRate[] = data.output.rateReplyDetails
      .filter((detail) => detail.totalNetCharge !== undefined && detail.totalNetCharge !== null)
      .map((detail) => {
        const charge = detail.totalNetCharge || 0;
        return {
          carrier: "FedEx",
          service: `FedEx ${(detail.serviceType || "Unknown").replace(/_/g, " ")}`,
          rate: parseFloat(charge.toString()) > 0 ? parseFloat(charge.toString()) : 9.99,
          estimatedDays: detail.businessDaysInTransit || getEstimatedDaysFromService(detail.serviceType || ""),
          currency: "USD",
        };
      });

    console.log(`[FedEx] Returning ${rates.length} rates`);
    return rates;
  } catch (error) {
    console.error("[FedEx] Failed to get rates:", error);
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
