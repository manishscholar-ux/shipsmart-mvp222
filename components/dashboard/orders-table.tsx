"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Order } from "@/lib/carriers";
import Link from "next/link";

interface OrdersTableProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
  onSelectAll: () => void;
}

export function OrdersTable({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
}: OrdersTableProps) {
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-warning text-warning-foreground bg-warning/10">
            Pending
          </Badge>
        );
      case "labeled":
        return (
          <Badge variant="outline" className="border-primary text-primary bg-primary/10">
            Labeled
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="outline" className="border-success text-success bg-success/10">
            Shipped
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Weight</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => onSelectOrder(order.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                {order.city}, {order.state} {order.zip}
              </TableCell>
              <TableCell className="text-right">{order.weight} lbs</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {order.status === "pending" && (
                    <Link href={`/dashboard/create-label?order=${order.id}`}>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-1 h-3 w-3" />
                        Create Label
                      </Button>
                    </Link>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Order</DropdownMenuItem>
                      <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
