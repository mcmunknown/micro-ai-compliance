# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Micro AI Compliance Scanner - A simple Next.js app that allows users to upload documents (PDF, CSV, TXT) and get AI-powered compliance analysis for ATO/IRS audit risks. Built following Pieter Levels' "ship ugly but functional" philosophy.

## Architecture

**Flow**: Auth → Payment ($10) → Document Upload → AI Analysis → Results
- Uses Firebase for authentication (Email/Password + Google)
- Stripe for $10 one-time payment to unlock document scanning
- OpenRouter + Claude for document analysis
- No document storage (browser-only processing)

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Key Environment Variables

Add these to `.env.local`:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# OpenRouter
OPENROUTER_API_KEY=
```

## Core Components

- `pages/index.tsx` - Main page with auth state, payment gate, and document upload
- `components/AuthProvider.tsx` - Firebase auth context
- `components/PayNowButton.tsx` - Stripe checkout integration
- `components/DocumentUpload.tsx` - File upload and AI analysis
- `utils/firebase.ts` - Firebase SDK initialization
- `utils/openrouter.ts` - AI document analysis function
- `pages/api/checkout.ts` - Stripe session creation
- `pages/api/analyze.ts` - Document analysis endpoint

## Payment Flow

1. User authenticates with Firebase
2. User pays $10 via Stripe Checkout
3. Redirects to `/?paid=true` on success
4. Payment status unlocks document upload feature
5. Uses query param/localStorage for payment verification

## AI Analysis

- Uses Claude via OpenRouter for compliance scanning
- Prompt: "Scan this document for compliance or audit risks for ATO/IRS. List any red flags and a one-line summary. Format as Markdown."
- Returns formatted Markdown response
- No document storage - files processed in browser only

## Current Status

Basic Next.js setup complete. Next steps: Firebase auth, Stripe payment, OpenRouter integration, and component development.