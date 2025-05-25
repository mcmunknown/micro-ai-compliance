# AI Compliance Scanner - Pricing Analysis & Strategy

## Cost Analysis

### OpenRouter API Costs (Claude 3.5 Sonnet)
- **Input**: $0.003 per 1,000 tokens
- **Output**: $0.015 per 1,000 tokens

### Average Document Analysis Cost
- Average document: ~2,000 words ≈ 2,667 tokens
- Prompt overhead: ~500 tokens
- Total input: ~3,167 tokens
- Average output: ~500 tokens (compliance report)

**Cost per scan**:
- Input cost: 3,167 × $0.003/1,000 = $0.0095
- Output cost: 500 × $0.015/1,000 = $0.0075
- **Total API cost per scan: $0.017**

### Stripe Transaction Fees
- 2.9% + $0.30 per transaction (USD)
- For AUD: 2.9% + $0.45 per transaction

## Recommended Credit Pricing Tiers

### Tier 1: Starter Pack
- **10 credits for $10 AUD**
- Price per scan: $1.00
- API cost per scan: $0.017
- Stripe fee (allocated): $0.59 (one-time on purchase)
- **Profit margin per scan: 94.1%**

### Tier 2: Professional Pack
- **50 credits for $40 AUD**
- Price per scan: $0.80
- API cost per scan: $0.017
- Stripe fee (allocated): $1.61/50 = $0.032 per scan
- **Profit margin per scan: 95.1%**

### Tier 3: Business Pack
- **200 credits for $120 AUD**
- Price per scan: $0.60
- API cost per scan: $0.017
- Stripe fee (allocated): $3.93/200 = $0.020 per scan
- **Profit margin per scan: 96.3%**

## Scan Depth Pricing

### Basic Scan (1 credit)
- Red flags and summary only
- ~300 tokens output
- API cost: ~$0.012

### Deep Scan (3 credits)
- Detailed per-transaction analysis
- Legal citations and region-specific notes
- ~1,000 tokens output
- API cost: ~$0.025

### Ultra Scan (10 credits)
- Full PDF report generation
- CSV audit log
- Remediation recommendations
- ~3,000 tokens output + PDF generation
- API cost: ~$0.065

## Free Credits Strategy
- **3 free credits on signup**
- Cost: $0.051 (3 × $0.017)
- Customer acquisition cost justified if 10% convert to paid

## Pro Plan Analysis
- **$99/month unlimited scans**
- Break-even: 5,824 scans/month (at $0.017 each)
- Target: Power users doing 100+ scans/month
- Estimated profit margin: 80-90% for typical usage

## Competitive Analysis
Based on market research:
- Most AI document analysis tools: $0.50-$2.00 per document
- Compliance-specific tools: Premium pricing ($1-5 per scan)
- Our pricing is competitive and allows for 94%+ profit margins

## Recommendations
1. Start with the proposed tiers to maintain 94%+ margins
2. Monitor usage patterns and adjust Deep/Ultra scan credits if needed
3. Implement rate limiting to prevent abuse
4. Consider volume discounts for enterprise clients
5. Track conversion rates from free credits to optimize CAC