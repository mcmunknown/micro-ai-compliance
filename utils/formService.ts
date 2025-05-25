import { RequiredForm } from './types/analysis'

// IRS/ATO Form URLs - Real forms from government sites
const FORM_URLS: Record<string, string> = {
  // IRS Forms
  'Form 8300': 'https://www.irs.gov/pub/irs-pdf/f8300.pdf',
  'Form 941': 'https://www.irs.gov/pub/irs-pdf/f941.pdf',
  'Form 1040': 'https://www.irs.gov/pub/irs-pdf/f1040.pdf',
  'Form 1120': 'https://www.irs.gov/pub/irs-pdf/f1120.pdf',
  'Form 2290': 'https://www.irs.gov/pub/irs-pdf/f2290.pdf',
  'Form W-2': 'https://www.irs.gov/pub/irs-pdf/fw2.pdf',
  'Form W-9': 'https://www.irs.gov/pub/irs-pdf/fw9.pdf',
  'Form 1099-MISC': 'https://www.irs.gov/pub/irs-pdf/f1099msc.pdf',
  'Form 1099-NEC': 'https://www.irs.gov/pub/irs-pdf/f1099nec.pdf',
  'Schedule C': 'https://www.irs.gov/pub/irs-pdf/f1040sc.pdf',
  
  // ATO Forms (Australian)
  'BAS': 'https://www.ato.gov.au/forms/business-activity-statement/',
  'TFN Declaration': 'https://www.ato.gov.au/forms/tfn-declaration/',
  'PAYG Summary': 'https://www.ato.gov.au/forms/payg-payment-summary-individual-non-business/',
}

// Online filing URLs
export const ONLINE_FILING_URLS: Record<string, string> = {
  // IRS
  'Form 8300': 'https://www.irs.gov/filing/e-file-form-8300',
  'Form 941': 'https://www.irs.gov/employment-taxes/e-file-form-941',
  'Form 1040': 'https://www.irs.gov/e-file-providers/before-starting-free-file-fillable-forms',
  'Form 1120': 'https://www.irs.gov/e-file-providers/modernized-e-file-mef-information',
  'Form 2290': 'https://www.irs.gov/e-file-providers/e-file-form-2290-heavy-highway-vehicle-use-tax-return',
  
  // ATO
  'BAS': 'https://www.ato.gov.au/business/business-activity-statements-(bas)/lodge-and-pay-your-bas/',
  'PAYG': 'https://www.ato.gov.au/business/payg-withholding/',
}

// Form instructions
export const FORM_INSTRUCTIONS: Record<string, string[]> = {
  'Form 8300': [
    'File within 15 days of receiving $10,000+ in cash',
    'Include complete payer identification',
    'Keep copy for 5 years',
    'Provide statement to payer by January 31'
  ],
  'Form 941': [
    'File quarterly by the last day of the month following quarter end',
    'Report all wages and tips',
    'Calculate employment taxes correctly',
    'Make deposits according to your schedule'
  ],
  'Form 1040': [
    'File by April 15 (or October 15 with extension)',
    'Report all income sources',
    'Claim only eligible deductions',
    'Sign and date the return'
  ]
}

// Download form with fallback
export async function downloadForm(formNumber: string): Promise<void> {
  const formUrl = FORM_URLS[formNumber]
  
  if (!formUrl) {
    // Fallback to IRS forms search
    window.open(`https://www.irs.gov/forms-instructions?search=${encodeURIComponent(formNumber)}`, '_blank')
    return
  }
  
  // Open form in new tab
  window.open(formUrl, '_blank')
}

// Get online filing URL
export function getOnlineFilingUrl(formNumber: string): string {
  return ONLINE_FILING_URLS[formNumber] || 'https://www.irs.gov/filing'
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
  const complexForms = ['Form 1120', 'Form 1065', 'Form 1040']
  const mediumForms = ['Form 941', 'Form 940', 'BAS']
  
  if (complexForms.includes(formNumber)) return '2-4 hours'
  if (mediumForms.includes(formNumber)) return '1-2 hours'
  return '30-60 minutes'
}