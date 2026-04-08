"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Truck, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "Total Orders",
    value: "1,234",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Labels Created",
    value: "892",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Truck,
  },
  {
    title: "Total Savings",
    value: "$2,456",
    change: "+24.3%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Avg. Shipping Cost",
    value: "$8.42",
    change: "-15.2%",
    changeType: "positive" as const,
    icon: TrendingDown,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
