import { RequiredForm } from './types/analysis'

// ATO Form URLs - Real forms from Australian government sites
const FORM_URLS: Record<string, string> = {
  // Australian Tax Office Forms
  'BAS': 'https://www.ato.gov.au/forms-and-instructions/business-activity-statement-bas',
  'BAS F': 'https://www.ato.gov.au/forms/bas-f-quarterly-bas/',
  'BAS P': 'https://www.ato.gov.au/forms-and-instructions/bas-p-annual-gst-return',
  'BAS Q': 'https://www.ato.gov.au/forms-and-instructions/bas-q-annual-gst-report',
  'GST Return': 'https://www.ato.gov.au/forms-and-instructions/approved-forms-consolidated-list-by-tax-topic/goods-and-services-tax-gst',
  'PAYG Withholding': 'https://www.ato.gov.au/forms-and-instructions/payg-withholding',
  'PAYG Summary': 'https://www.ato.gov.au/forms/payg-payment-summary-individual-non-business/',
  'TFN Declaration': 'https://www.ato.gov.au/forms/tfn-declaration/',
  'ABN Application': 'https://www.ato.gov.au/forms/abn-application/',
  'Tax Return': 'https://www.ato.gov.au/individuals/lodging-your-tax-return/',
  
  // AUSTRAC Forms (Cash Reporting)
  'TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/threshold-transaction-reports-ttrs',
  'AUSTRAC TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/threshold-transaction-reports-ttrs',
  
  // State Forms
  'Payroll Tax': 'https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax',
}

// Online filing URLs
export const ONLINE_FILING_URLS: Record<string, string> = {
  // ATO Online Services
  'BAS': 'https://www.ato.gov.au/business/business-activity-statements-bas/lodging-and-paying-your-bas/',
  'BAS F': 'https://www.ato.gov.au/business/business-activity-statements-bas/lodging-and-paying-your-bas/',
  'BAS P': 'https://www.ato.gov.au/business/business-activity-statements-bas/lodging-and-paying-your-bas/',
  'BAS Q': 'https://www.ato.gov.au/business/business-activity-statements-bas/lodging-and-paying-your-bas/',
  'GST Return': 'https://www.ato.gov.au/business/gst/lodging-your-bas-or-annual-gst-return/',
  'PAYG Withholding': 'https://www.ato.gov.au/business/payg-withholding/',
  'PAYG Summary': 'https://www.ato.gov.au/business/single-touch-payroll/',
  'Tax Return': 'https://my.gov.au/',
  'ABN Application': 'https://www.abr.gov.au/business-super-funds-charities/applying-abn',
  
  // AUSTRAC Online
  'TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online',
  'AUSTRAC TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online',
  
  // State Revenue Online
  'Payroll Tax': 'https://www.revenue.nsw.gov.au/help-centre/online-services',
}

// Form instructions
export const FORM_INSTRUCTIONS: Record<string, string[]> = {
  'BAS': [
    'Lodge quarterly by the 28th of the month after quarter end',
    'Report all GST collected and paid',
    'Include PAYG withholding and instalments',
    'Keep records for 5 years'
  ],
  'BAS F': [
    'For quarterly GST and PAYG obligations',
    'Due 28 days after quarter end',
    'Report all business income and expenses',
    'Pay any amount owing or claim refund'
  ],
  'TTR': [
    'Report within 10 business days of receiving $10,000+ AUD in cash',
    'Include complete customer identification',
    'Submit via AUSTRAC Online',
    'Penalties up to $222,000 for non-compliance'
  ],
  'AUSTRAC TTR': [
    'Threshold Transaction Report for cash over $10,000',
    'Must be submitted within 10 business days',
    'Verify customer identity and keep records',
    'Report through AUSTRAC Online system'
  ],
  'PAYG Summary': [
    'Due by 14 August each year',
    'Report all payments to employees',
    'Provide copies to employees by 14 July',
    'Lodge via Single Touch Payroll'
  ],
  'Tax Return': [
    'Lodge by 31 October (or later with tax agent)',
    'Report all income including foreign income',
    'Claim only eligible deductions',
    'Keep receipts and records'
  ]
}

// Download form with fallback
export async function downloadForm(formNumber: string): Promise<void> {
  const formUrl = FORM_URLS[formNumber]
  
  if (!formUrl) {
    // Fallback to ATO forms search
    window.open(`https://www.ato.gov.au/forms-and-instructions?search=${encodeURIComponent(formNumber)}`, '_blank')
    return
  }
  
  // Open form in new tab
  window.open(formUrl, '_blank')
}

// Get online filing URL
export function getOnlineFilingUrl(formNumber: string): string {
  return ONLINE_FILING_URLS[formNumber] || 'https://www.ato.gov.au/lodgment'
}

// Generate pre-filled form data instructions
export function generatePrefilledInstructions(form: RequiredForm): string {
  if (!form.prefillData || Object.keys(form.prefillData).length === 0) {
    return ''
  }
  
  const fields = Object.entries(form.prefillData)
    .map(([field, value]) => `${field}: ${value}`)
    .join('\n')
  
  return `Pre-filled data available:\n${fields}\n\nCopy this information when filling out the form.`
}

// Check if form can be filed online
export function canFileOnline(formNumber: string): boolean {
  return formNumber in ONLINE_FILING_URLS
}

// Get form-specific instructions
export function getFormInstructions(formNumber: string): string[] {
  return FORM_INSTRUCTIONS[formNumber] || [
    'Review form instructions carefully',
    'Gather all required documentation',
    'Complete all mandatory fields',
    'File by the deadline to avoid penalties'
  ]
}

// Calculate estimated time to complete form
export function getEstimatedFormTime(formNumber: string): string {
  const complexForms = ['Tax Return', 'Annual GST Return', 'FBT Return']
  const mediumForms = ['BAS', 'BAS F', 'BAS P', 'BAS Q', 'PAYG Summary']
  const quickForms = ['TTR', 'AUSTRAC TTR', 'TFN Declaration']
  
  if (complexForms.includes(formNumber)) return '2-4 hours'
  if (mediumForms.includes(formNumber)) return '1-2 hours'
  if (quickForms.includes(formNumber)) return '15-30 minutes'
  return '30-60 minutes'
}