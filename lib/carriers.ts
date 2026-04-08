export interface Carrier {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export const carriers: Carrier[] = [
  {
    id: "ups",
    name: "UPS",
    logo: "UPS",
    color: "#4B2E12",
  },
  {
    id: "fedex",
    name: "FedEx",
    logo: "FedEx",
    color: "#4D148C",
  },
  {
    id: "usps",
    name: "USPS",
    logo: "USPS",
    color: "#004B87",
  },
  {
    id: "dhl",
    name: "DHL",
    logo: "DHL",
    color: "#FFCC00",
  },
];

export interface ShippingService {
  id: string;
  carrierId: string;
  name: string;
  deliveryDays: string;
  price: number;
}

export interface ShipmentDetails {
  weight: number;
  length: number;
  width: number;
  height: number;
  fromZip: string;
  toZip: string;
}

export function generateRates(details: ShipmentDetails): ShippingService[] {
  const basePrice = details.weight * 0.5 + (details.length * details.width * details.height) / 1000;
  
  return [
    {
      id: "ups-ground",
      carrierId: "ups",
      name: "UPS Ground",
      deliveryDays: "3-5 business days",
      price: Math.round((basePrice * 1.1 + 5.99) * 100) / 100,
    },
    {
      id: "ups-3day",
      carrierId: "ups",
      name: "UPS 3 Day Select",
      deliveryDays: "3 business days",
      price: Math.round((basePrice * 1.5 + 12.99) * 100) / 100,
    },
    {
      id: "ups-2day",
      carrierId: "ups",
      name: "UPS 2nd Day Air",
      deliveryDays: "2 business days",
      price: Math.round((basePrice * 2.0 + 18.99) * 100) / 100,
    },
    {
      id: "fedex-ground",
      carrierId: "fedex",
      name: "FedEx Ground",
      deliveryDays: "3-5 business days",
      price: Math.round((basePrice * 1.05 + 5.49) * 100) / 100,
    },
    {
      id: "fedex-express",
      carrierId: "fedex",
      name: "FedEx Express Saver",
      deliveryDays: "3 business days",
      price: Math.round((basePrice * 1.4 + 11.99) * 100) / 100,
    },
    {
      id: "fedex-2day",
      carrierId: "fedex",
      name: "FedEx 2Day",
      deliveryDays: "2 business days",
      price: Math.round((basePrice * 1.9 + 17.49) * 100) / 100,
    },
    {
      id: "usps-priority",
      carrierId: "usps",
      name: "USPS Priority Mail",
      deliveryDays: "2-3 business days",
      price: Math.round((basePrice * 0.9 + 7.99) * 100) / 100,
    },
    {
      id: "usps-ground",
      carrierId: "usps",
      name: "USPS Ground Advantage",
      deliveryDays: "2-5 business days",
      price: Math.round((basePrice * 0.8 + 4.99) * 100) / 100,
    },
    {
      id: "usps-express",
      carrierId: "usps",
      name: "USPS Priority Express",
      deliveryDays: "1-2 business days",
      price: Math.round((basePrice * 2.2 + 22.99) * 100) / 100,
    },
    {
      id: "dhl-express",
      carrierId: "dhl",
      name: "DHL Express",
      deliveryDays: "1-2 business days",
      price: Math.round((basePrice * 2.5 + 25.99) * 100) / 100,
    },
    {
      id: "dhl-ground",
      carrierId: "dhl",
      name: "DHL Parcel Ground",
      deliveryDays: "4-6 business days",
      price: Math.round((basePrice * 0.95 + 5.29) * 100) / 100,
    },
  ].sort((a, b) => a.price - b.price);
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: number;
  weight: number;
  status: "pending" | "labeled" | "shipped";
  createdAt: Date;
}

export const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerName: "John Smith",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    items: 2,
    weight: 3.5,
    status: "pending",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Sarah Johnson",
    address: "456 Oak Ave",
    city: "New York",
    state: "NY",
    zip: "10001",
    items: 1,
    weight: 1.2,
    status: "pending",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Mike Williams",
    address: "789 Pine Rd",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    items: 5,
    weight: 8.7,
    status: "labeled",
    createdAt: new Date("2024-03-14"),
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerName: "Emily Brown",
    address: "321 Elm St",
    city: "Houston",
    state: "TX",
    zip: "77001",
    items: 3,
    weight: 4.2,
    status: "shipped",
    createdAt: new Date("2024-03-14"),
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerName: "David Lee",
    address: "654 Cedar Blvd",
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    items: 2,
    weight: 2.8,
    status: "pending",
    createdAt: new Date("2024-03-15"),
  },
];
