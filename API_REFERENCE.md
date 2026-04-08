# API Reference

## Base URL
```
http://localhost:3000/api
https://yourdomain.com/api (in production)
```

## Authentication
- Login via `/auth/signin` or register via `/auth/register`
- Include JWT token in Authorization header for protected routes
- All dashboard/orders/shipping endpoints require authentication

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "businessName": "My Shipping Co"
}

Response: 201
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Sign In
```
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 (session created)
```

### Orders

#### List Orders
```
GET /orders
Authorization: Bearer {token}

Response: 200
[
  {
    "id": "clx...",
    "orderNumber": "ORD-1234567890",
    "toName": "John Doe",
    "status": "PENDING",
    "weight": 2.5,
    "selectedRate": 12.99,
    "trackingNumber": null,
    "createdAt": "2024-04-08T..."
  }
]
```

#### Create Order
```
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromName": "Your Business",
  "fromAddressLine1": "123 Warehouse St",
  "fromCity": "Los Angeles",
  "fromState": "CA",
  "fromZip": "90001",
  "toName": "Customer Name",
  "toAddressLine1": "456 Main St",
  "toCity": "New York",
  "toState": "NY",
  "toZip": "10001",
  "weight": 2.5,
  "weightUnit": "lbs",
  "length": 12,
  "width": 8,
  "height": 6,
  "dimensionUnit": "in",
  "status": "PENDING"
}

Response: 201
{
  "id": "clx...",
  "orderNumber": "ORD-1234567890",
  "userId": "clx...",
  "status": "PENDING",
  ...
}
```

#### Get Order
```
GET /orders/{id}
Authorization: Bearer {token}

Response: 200
{
  "id": "clx...",
  "orderNumber": "ORD-1234567890",
  ...
}
```

#### Update Order
```
PATCH /orders/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "LABELED",
  "trackingNumber": "1Z999AA10123456784"
}

Response: 200
{
  "id": "clx...",
  ...
}
```

#### Delete Order
```
DELETE /orders/{id}
Authorization: Bearer {token}

Response: 200
{
  "message": "Order deleted successfully"
}
```

### Shipping

#### Calculate Rates
```
POST /shipping/calculate-rates
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight": 2.5,
  "length": 12,
  "width": 8,
  "height": 6,
  "fromZip": "90001",
  "toZip": "10001",
  "isInternational": false
}

Response: 200
{
  "rates": [
    {
      "carrier": "USPS",
      "service": "Ground Advantage",
      "rate": 5.99,
      "estimatedDays": 5,
      "currency": "USD"
    },
    {
      "carrier": "UPS",
      "service": "Ground",
      "rate": 8.99,
      "estimatedDays": 5,
      "currency": "USD"
    },
    ...
  ],
  "bestRate": {
    "carrier": "USPS",
    "service": "Ground Advantage",
    "rate": 5.99,
    "estimatedDays": 5,
    "currency": "USD"
  },
  "timestamp": "2024-04-08T..."
}
```

#### Create Label
```
POST /shipping/create-label
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "clx...",
  "carrier": "USPS",
  "service": "Ground Advantage",
  "rate": 5.99
}

Response: 201
{
  "label": {
    "id": "clx...",
    "orderId": "clx...",
    "carrier": "USPS",
    "trackingNumber": "USPS1712878234932",
    "labelFormat": "PDF",
    "createdAt": "2024-04-08T..."
  },
  "trackingNumber": "USPS1712878234932",
  "message": "Label created successfully"
}
```

### Dashboard

#### Get Dashboard Stats
```
GET /dashboard/stats
Authorization: Bearer {token}

Response: 200
{
  "totalOrders": 42,
  "totalLabels": 35,
  "pendingOrders": 5,
  "labeledOrders": 2,
  "shippedOrders": 35,
  "subscriptionTier": "STARTER",
  "recentOrders": [
    {
      "id": "clx...",
      "orderNumber": "ORD-...",
      "toName": "Customer",
      "status": "PENDING",
      "createdAt": "2024-04-08T..."
    }
  ]
}
```

### User

#### Get User Profile
```
GET /user/profile
Authorization: Bearer {token}

Response: 200
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe",
  "businessName": "My Shipping Co",
  "phone": "555-0100",
  "subscriptions": [...],
  "carrierAccounts": [...],
  "apiKeys": [...]
}
```

#### Update User Profile
```
PATCH /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "businessName": "Updated Business",
  "phone": "555-0100",
  "addressLine1": "123 New Street",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "US"
}

Response: 200
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to process request"
}
```

## Rate Limiting
Currently unlimited (implement rate limiting in production)

## Pagination
Not yet implemented (add in future update)

## Filtering
Use query parameters where supported:
```
GET /orders?status=PENDING
GET /orders?search=customerName
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fromName": "Your Co",
    "fromZip": "90001",
    "toName": "Customer",
    "toZip": "10001",
    "weight": 2.5
  }'
```

### Calculate Rates
```bash
curl -X POST http://localhost:3000/api/shipping/calculate-rates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "weight": 2.5,
    "fromZip": "90001",
    "toZip": "10001",
    "isInternational": false
  }'
```

## Webhooks (Coming Soon)
- Order created
- Label generated
- Shipment tracked
- Delivery confirmed

## Rate Limits (Coming Soon)
- Starter: 100 labels/month
- Pro: 1000 labels/month
- Enterprise: Unlimited

## Versioning
Current version: v1 (no prefix needed)
Future: `/api/v2/` for breaking changes
