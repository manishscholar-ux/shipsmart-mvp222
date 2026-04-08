import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  try {
    // Clear existing data
    await prisma.order.deleteMany();
    await prisma.label.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const hashedPassword = await hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
        businessName: "Test Shipping Co",
        businessType: "ecommerce",
        addressLine1: "123 Warehouse St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "US",
        phone: "555-0100"
      }
    });

    // Create subscription for test user
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: "STARTER",
        status: "ACTIVE",
        stripeCustomerId: `cus_test_${Date.now()}`,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    // Create sample orders
    const order1 = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now()}-1`,
        status: "PENDING",
        fromName: "Test Shipping Co",
        fromAddressLine1: "123 Warehouse St",
        fromCity: "Los Angeles",
        fromState: "CA",
        fromZip: "90001",
        fromCountry: "US",
        toName: "John Doe",
        toAddressLine1: "456 Main St",
        toCity: "New York",
        toState: "NY",
        toZip: "10001",
        toCountry: "US",
        weight: 2.5,
        weightUnit: "lbs",
        length: 12,
        width: 8,
        height: 6,
        dimensionUnit: "in"
      }
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now()}-2`,
        status: "LABELED",
        fromName: "Test Shipping Co",
        fromAddressLine1: "123 Warehouse St",
        fromCity: "Los Angeles",
        fromState: "CA",
        fromZip: "90001",
        fromCountry: "US",
        toName: "Jane Smith",
        toAddressLine1: "789 Oak Ave",
        toCity: "Chicago",
        toState: "IL",
        toZip: "60601",
        toCountry: "US",
        weight: 1.8,
        weightUnit: "lbs",
        length: 10,
        width: 7,
        height: 5,
        dimensionUnit: "in",
        selectedCarrier: "UPS",
        selectedService: "Ground",
        selectedRate: 12.99,
        trackingNumber: "1Z999AA10123456784"
      }
    });

    console.log("✅ Database seeded successfully!");
    console.log(`Created user: ${user.email}`);
    console.log(`Created ${2} sample orders`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
