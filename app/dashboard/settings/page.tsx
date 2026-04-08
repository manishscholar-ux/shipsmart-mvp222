"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Check, Plus } from "lucide-react";
import { carriers } from "@/lib/carriers";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and carrier integrations
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="carriers">Carrier Accounts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details used on shipping labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
                    <Input id="businessName" defaultValue="Acme Store Inc." />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" defaultValue="shipping@acmestore.com" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="address">Street Address</FieldLabel>
                  <Input id="address" defaultValue="123 Warehouse St" />
                </Field>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input id="city" defaultValue="Los Angeles" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="state">State</FieldLabel>
                    <Input id="state" defaultValue="CA" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="zip">ZIP Code</FieldLabel>
                    <Input id="zip" defaultValue="90210" />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </Field>
              </FieldGroup>
              <div className="mt-6">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carriers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Carriers</CardTitle>
              <CardDescription>
                Manage your carrier account integrations to access commercial
                rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-16 items-center justify-center rounded text-sm font-bold"
                      style={{
                        backgroundColor: carrier.color,
                        color: carrier.id === "dhl" ? "#000" : "#fff",
                      }}
                    >
                      {carrier.logo}
                    </div>
                    <div>
                      <p className="font-semibold">{carrier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Account connected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-success text-success bg-success/10">
                      <Check className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Connect Another Carrier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when you receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Label Created</p>
                  <p className="text-sm text-muted-foreground">
                    Receive confirmation when a label is created
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Shipment Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about delivery status changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delivery Exceptions</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when a package has delivery issues
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly shipping summary report
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage your API keys for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">API Key</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    type="password"
                    value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="font-mono"
                  />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Keep this key secret. Do not share it in public repositories
                  or client-side code.
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Webhook URL</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="https://your-domain.com/webhooks/shipping"
                    className="font-mono"
                  />
                  <Button>Save</Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll send shipment status updates to this URL
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
