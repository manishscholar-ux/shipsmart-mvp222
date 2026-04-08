# ShipSmart - Shipping Label Platform

A modern, full-stack Next.js application for creating and managing shipping labels with real-time rate comparison across multiple carriers (UPS, FedEx, USPS, DHL).

## Features

- ✅ User authentication with NextAuth.js
- ✅ Multi-carrier shipping rate comparison
- ✅ Order management system
- ✅ Shipping label generation
- ✅ Real-time tracking number assignment
- ✅ Subscription-based billing
- ✅ Responsive dashboard UI
- ✅ API endpoints for integrations

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS, Radix UI
- **State**: React hooks, API calls
- **PDF Generation**: @react-pdf/renderer

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm package manager

## Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd shipsmart
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/shipsmart"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key" # Generate with: openssl rand -base64 32
```

4. **Set up the database**
```bash
pnpm prisma:push
```

5. **Seed the database with test data**
```bash
pnpm tsx scripts/seed.ts
```

6. **Start the development server**
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Default Test Credentials

- **Email**: test@example.com
- **Password**: password123

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── orders/         # Order CRUD operations
│   │   ├── shipping/       # Shipping/label operations
│   │   ├── dashboard/      # Dashboard data
│   │   └── user/           # User profile
│   ├── dashboard/          # Protected dashboard pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── auth.ts            # Authentication setup
│   ├── prisma.ts          # Prisma client
│   ├── carriers.ts        # Carrier mock data
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   └── seed.ts            # Database seeding script
├── middleware.ts          # Route protection middleware
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in (via NextAuth)
- `GET /api/auth/session` - Get current session

### Orders
- `GET /api/orders` - List all user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get specific order
- `PATCH /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order

### Shipping
- `POST /api/shipping/calculate-rates` - Calculate shipping rates
- `POST /api/shipping/create-label` - Create shipping label

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

## Key Features Explained

### Rate Calculation
The platform calculates shipping rates based on:
- Package weight
- Package dimensions (length, width, height)
- Origin and destination ZIP codes
- Dimensional weight calculations
- Carrier-specific pricing

Current carriers supported:
- USPS (Ground Advantage, Priority Mail, Priority Express)
- UPS (Ground, 3-Day Select, 2nd Day Air)
- FedEx (Ground, Express Saver, 2Day)
- DHL (Express, Parcel Ground)

### Label Generation
Shipping labels are created with:
- Carrier information
- Barcode/tracking number
- From/To addresses
- Package details
- Cost information

### Order Management
Orders can be:
- Created manually or imported
- Filtered by status (Pending, Labeled, Shipped)
- Bulk processed for label creation
- Tracked throughout their lifecycle

## Development Workflow

1. **Create new API endpoint**
   - Create route file in `app/api/route.ts`
   - Add Prisma operations for database
   - Include authentication checks

2. **Update schema**
   - Modify `prisma/schema.prisma`
   - Run `pnpm prisma:push` or `pnpm prisma:migrate`

3. **Add components**
   - Create in `components/`
   - Use existing shadows/ui components
   - Follow TypeScript best practices

4. **Test changes**
   - Use test user credentials
   - Check console for errors
   - Verify database records

## Next Steps for Production

1. **Carrier Integrations** - Implement real carrier APIs:
   - USPS Web Services
   - UPS Shipping APIs
   - FedEx Web Services
   - DHL Express APIs

2. **Payment Processing**
   - Set up Stripe integration
   - Implement subscription management
   - Add invoice generation

3. **Email Notifications**
   - Set up Resend or SendGrid
   - Create email templates
   - Implement transactional emails

4. **File Storage**
   - Set up AWS S3 or similar
   - Store generated PDF labels
   - Implement file download/print

5. **Enhanced Features**
   - Batch label printing
   - Shipping label reprinting
   - Advanced reporting
   - Customer portal

## Troubleshooting

### Database connection error
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Run `pnpm prisma:push` to sync schema

### Authentication issues
- Verify NEXTAUTH_SECRET is set
- Check email/password in seed data
- Clear browser cookies and try again

### API errors
- Check middleware.ts for route protection
- Verify session is valid
- Check console for detailed error messages

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and screenshots

---

**Happy shipping! 🚀**
