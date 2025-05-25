# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Micro AI Compliance Scanner - A Next.js SaaS that allows users to upload documents (PDF, CSV, TXT) and get AI-powered compliance analysis for ATO/IRS audit risks. Built following Pieter Levels' "ship ugly but functional" philosophy, with a credit-based monetization model.

## Architecture

**Flow**: Auth → Free Credits (3) → Document Upload → AI Analysis → Buy More Credits
- Uses Firebase for authentication (Email/Password + Google)
- Firebase Firestore for credit tracking and rate limiting
- Stripe for credit pack purchases
- OpenRouter + Claude 3.5 Sonnet for document analysis
- No document storage (browser-only processing)

## Credit System & Pricing

### Credit Packs (Monthly Subscriptions)
- **Starter**: 10 credits/month for $10/month ($1.00/credit)
- **Professional**: 50 credits/month for $40/month ($0.80/credit) - MOST POPULAR
- **Business**: 200 credits/month for $120/month ($0.60/credit)

### Scan Types
- **Basic Scan**: 1 credit - Red flags and summary
- **Deep Scan**: 3 credits - Detailed analysis with citations
- **Ultra Scan**: 10 credits - Full forensic audit report

### Profit Margins
Based on Claude 3.5 Sonnet pricing ($0.003/1k input, $0.015/1k output):
- Basic scan cost: ~$0.017 → 94% profit margin
- Deep scan cost: ~$0.051 → 95% profit margin  
- Ultra scan cost: ~$0.085 → 96% profit margin

### User Journey
1. New users get 3 free credits on signup
2. Can perform 3 basic scans or 1 deep scan for free
3. Rate limited to 10 scans per day
4. Must purchase credits to continue

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

## Key Environment Variables

See `.env.example` for full list:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# OpenRouter
OPENROUTER_API_KEY=

# Stripe Price IDs (create in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_10_CREDITS=
NEXT_PUBLIC_STRIPE_PRICE_50_CREDITS=
NEXT_PUBLIC_STRIPE_PRICE_200_CREDITS=

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Core Components

### Pages
- `pages/index.tsx` - Main dashboard with credit display and document upload
- `pages/api/analyze.ts` - Document analysis endpoint (supports scan types)
- `pages/api/create-checkout-session.ts` - Stripe checkout for credit purchases
- `pages/api/webhooks/stripe.ts` - Webhook to add credits after payment

### Components
- `components/AuthProvider.tsx` - Firebase auth + credit initialization
- `components/DocumentUpload.tsx` - File upload with scan type selection
- `components/CreditsDisplay.tsx` - Shows user credits in header
- `components/BuyCreditsModal.tsx` - Credit pack purchase interface
- `components/LandingPage.tsx` - Professional landing page
- `components/AuthForm.tsx` - Sign in/up forms

### Utilities
- `utils/credits.ts` - Credit system logic (deduct, add, check limits)
- `utils/firebase.ts` - Firebase SDK + Firestore initialization
- `utils/openrouter.ts` - AI analysis with variable prompts by scan type

## Database Schema (Firestore)

### Collection: `userCredits`
```typescript
{
  userId: string,
  credits: number,
  freeCreditsUsed: boolean,
  totalSpent: number,
  scansToday: number,
  lastScanDate: string,
  scanHistory: Array<{
    timestamp: Date,
    type: 'basic' | 'deep' | 'ultra',
    creditsUsed: number,
    documentName: string
  }>,
  lastPurchase?: Date,
  createdAt: Timestamp
}
```

## Stripe Integration

### Products to Create in Stripe Dashboard
1. Create 3 subscription products for credit packs
2. Set monthly prices: $10/month, $40/month, $120/month
3. Add price IDs to environment variables
4. Configure webhook endpoint: `/api/webhooks/stripe`
5. Set webhook to listen for `checkout.session.completed`

### Webhook Security
- Verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
- Only process `checkout.session.completed` events
- Add credits based on metadata in session

## AI Analysis Prompts

### Basic Scan (1 credit)
Simple compliance check focusing on red flags and summary.

### Deep Scan (3 credits)
Detailed analysis including:
- Executive summary with risk score
- Transaction-level analysis
- Legal citations
- Region-specific compliance
- Recommendations

### Ultra Scan (10 credits)
Comprehensive forensic audit with:
- Risk matrix by severity
- Penalty calculations
- Remediation roadmap
- Audit defense strategy
- Professional service recommendations

## Security Considerations

1. **No Document Storage**: Files processed in browser, never stored
2. **Rate Limiting**: 10 scans per day per user
3. **Credit Validation**: Server-side checks before processing
4. **Secure Payments**: All transactions via Stripe
5. **Auth Required**: Must be logged in to scan

## Future Enhancements (Not Yet Implemented)

1. **Pro Plan**: $99/month for unlimited scans
2. **Admin Dashboard**: Credit management tools
3. **Bulk Scanning**: Upload multiple documents
4. **API Access**: For enterprise integration
5. **Export Options**: PDF reports, CSV logs
6. **Team Accounts**: Shared credit pools

## Deployment Notes

1. Set all environment variables in production
2. Configure Stripe webhook URL to production domain
3. Ensure Firebase security rules are properly configured
4. Monitor OpenRouter API usage and costs
5. Set up error tracking (e.g., Sentry)

## Support & Maintenance

- Monitor credit purchase conversion rates
- Track most popular scan types
- Review AI response quality regularly
- Keep prompts updated with latest regulations
- Monitor for abuse (rate limiting effectiveness)