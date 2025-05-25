# 🚨 URGENT SECURITY FIXES REQUIRED

## 1. REMOVE SECRETS FROM GIT IMMEDIATELY
```bash
# Remove sensitive files from Git history
git rm --cached .env.local .env.local.backup
git commit -m "Remove exposed secrets"

# You MUST rotate ALL credentials:
# - Generate new Firebase API keys
# - Create new Stripe API keys
# - Generate new OpenRouter API key
# - Revoke the exposed Vercel OIDC token
```

## 2. ADD AUTHENTICATION TO API ENDPOINTS
```typescript
// pages/api/analyze.ts
import { getAuth } from 'firebase-admin/auth'
import { getUserCredits, canUserScan, deductCredits } from '@/utils/credits'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify Firebase auth token
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    // Check credits BEFORE processing
    const { canScan, reason } = await canUserScan(userId, scanType)
    if (!canScan) {
      return res.status(403).json({ error: reason })
    }

    // Process document
    const analysis = await analyzeDocument(text, scanType)
    
    // Deduct credits AFTER successful processing
    await deductCredits(userId, scanType, documentName)
    
    return res.status(200).json({ analysis })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

## 3. SECURE FIRESTORE RULES
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /userCredits/{userId} {
      // Read own document only
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // NO CLIENT WRITES - only server can modify credits
      allow write: if false;
      
      // Alternative: Allow limited updates with validation
      // allow update: if request.auth != null 
      //   && request.auth.uid == userId
      //   && request.resource.data.credits <= resource.data.credits // Can't increase credits
      //   && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['scansToday', 'lastScanDate', 'scanHistory']);
    }
  }
}
```

## 4. ADD STRIPE WEBHOOK SECRET
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Copy the webhook secret (starts with `whsec_`)
4. Add to environment: `STRIPE_WEBHOOK_SECRET=whsec_...`

## 5. IMPLEMENT SERVER-SIDE CREDIT MANAGEMENT
Create Firebase Admin SDK functions that run server-side only:

```typescript
// utils/firebase-admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const adminDb = getFirestore()

// Server-only credit functions
export async function serverAddCredits(userId: string, credits: number) {
  return adminDb.collection('userCredits').doc(userId).update({
    credits: FieldValue.increment(credits),
    lastPurchase: FieldValue.serverTimestamp(),
  })
}

export async function serverDeductCredits(userId: string, amount: number) {
  return adminDb.collection('userCredits').doc(userId).update({
    credits: FieldValue.increment(-amount),
  })
}
```

## 6. ADD RATE LIMITING MIDDLEWARE
```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  message: 'Rate limit exceeded'
})
```

## 7. ENVIRONMENT VARIABLE SECURITY
1. Use Vercel environment variables (not .env files)
2. Set different values for development/preview/production
3. Never commit .env files
4. Add to .gitignore:
   ```
   .env*
   !.env.example
   ```

## 8. ADDITIONAL SECURITY MEASURES
- Enable Firebase App Check
- Add CORS restrictions
- Implement request signing
- Add API key rotation schedule
- Set up security monitoring alerts
- Enable Stripe webhook signature verification
- Add request logging and anomaly detection

## IMMEDIATE PRIORITY:
1. **ROTATE ALL EXPOSED CREDENTIALS NOW**
2. Remove secrets from Git history
3. Add authentication to API endpoints
4. Fix Firestore rules to prevent client-side credit manipulation
5. Configure Stripe webhook secret

These vulnerabilities allow attackers to:
- Use your services without paying
- Access your database
- Charge your Stripe account
- Manipulate user credits
- Potentially access user data

Fix these issues IMMEDIATELY before going to production!