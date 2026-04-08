"use client";

import { useState, useEffect } from "react";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Upload, Filter, Search } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  toName: string;
  status: string;
  selectedRate?: number;
  trackingNumber?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.toName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const labeledCount = orders.filter((o) => o.status === "LABELED").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;

  // Transform data to match OrdersTable expectations
  const tableOrders = filteredOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.toName,
    status: order.status.toLowerCase(),
    cost: order.selectedRate || 0,
    tracking: order.trackingNumber,
    date: new Date(order.createdAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage your orders and create shipping labels
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Orders
          </Button>
          <Link href="/dashboard/create-label">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Label
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter("PENDING")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10">
              Needs Label
            </Badge>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter("LABELED")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Labeled</p>
              <p className="text-2xl font-bold">{labeledCount}</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary bg-primary/10">
              Ready to Ship
            </Badge>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter("SHIPPED")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-2xl font-bold">{shippedCount}</p>
            </div>
            <Badge variant="outline" className="border-success text-success bg-success/10">
              In Transit
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                {filteredOrders.length} orders{" "}
                {statusFilter !== "all" && `(filtered by ${statusFilter})`}
              </CardDescription>
            </div>
            {selectedOrders.length > 0 && (
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create {selectedOrders.length} Labels
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="LABELED">Labeled</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
    </div>
  );
}
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setStatusFilter("shipped")}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-2xl font-bold">{shippedCount}</p>
            </div>
            <Badge variant="outline" className="border-success text-success bg-success/10">
              In Transit
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                {filteredOrders.length} orders{" "}
                {statusFilter !== "all" && `(filtered by ${statusFilter})`}
              </CardDescription>
            </div>
            {selectedOrders.length > 0 && (
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create {selectedOrders.length} Labels
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="labeled">Labeled</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <OrdersTable
            orders={filteredOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
      </Card>
    </div>
  );
}
