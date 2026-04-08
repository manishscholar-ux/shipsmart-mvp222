"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { CarrierCards } from "@/components/dashboard/carrier-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalOrders: number;
  totalLabels: number;
  pendingOrders: number;
  labeledOrders: number;
  shippedOrders: number;
  subscriptionTier: string;
  recentOrders: any[];
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const tableOrders = (stats?.recentOrders || []).map((order: any) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.toName,
    status: order.status.toLowerCase(),
    cost: order.selectedRate || 0,
    tracking: order.trackingNumber,
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === tableOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(tableOrders.map((o) => o.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your shipping overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/create-label">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Label
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  {stats?.pendingOrders || 0} orders awaiting labels
                </CardDescription>
              </div>
              {selectedOrders.length > 0 && (
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Create {selectedOrders.length} Labels
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <OrdersTable
                orders={tableOrders}
                selectedOrders={selectedOrders}
                onSelectOrder={handleSelectOrder}
                onSelectAll={handleSelectAll}
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Carriers</CardTitle>
              <CardDescription>
                Your integrated shipping carriers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CarrierCards />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subscription Tier</span>
                <span className="font-semibold">{stats?.subscriptionTier || "STARTER"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-semibold">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Labels Created</span>
                <span className="font-semibold">{stats?.totalLabels || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shipped Orders</span>
                <span className="font-semibold text-success">{stats?.shippedOrders || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
                <span className="text-muted-foreground">Most used carrier</span>
                <span className="font-semibold">USPS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. delivery time</span>
                <span className="font-semibold">3.2 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Labels this week</span>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Savings this week</span>
                <span className="font-semibold text-success">$124.50</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
