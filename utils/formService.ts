import { RequiredForm } from './types/analysis'

// Form availability types
export type FormAvailability = 'PDF' | 'ONLINE_ONLY' | 'LOGIN_REQUIRED'

export interface FormInfo {
  url: string
  availability: FormAvailability
  description?: string
  portalUrl?: string
}

// ATO Form URLs - Updated May 2025 with working links
const FORM_INFO: Record<string, FormInfo> = {
  // BAS Forms - Most are sample PDFs only, real forms via portal
  'BAS': {
    url: 'https://www.ato.gov.au/forms-and-instructions/approved-forms-consolidated-list-by-tax-topic/business-activity-statements-bas',
    availability: 'ONLINE_ONLY',
    description: 'Lodge via ATO Business Portal or tax agent',
    portalUrl: 'https://bp.ato.gov.au/'
  },
  'BAS A': {
    url: 'https://www.ato.gov.au/forms-and-instructions/bas-a-quarterly-bas',
    availability: 'PDF',
    description: 'NAT 4189 - Quarterly GST, PAYG withholding and instalments'
  },
  'BAS F': {
    url: 'https://www.ato.gov.au/forms-and-instructions/bas-f-quarterly-bas', 
    availability: 'PDF',
    description: 'NAT 4190 - Quarterly GST and PAYG withholding'
  },
  'BAS D': {
    url: 'https://www.ato.gov.au/Forms/BAS-D---quarterly-BAS/',
    availability: 'PDF',
    description: 'NAT 4191 - Quarterly GST only'
  },
  'BAS Y': {
    url: 'https://www.ato.gov.au/Forms/BAS-Y---monthly-BAS/',
    availability: 'PDF',
    description: 'NAT 14171 - Monthly GST and fuel tax credits'
  },
  'BAS P': {
    url: 'https://www.ato.gov.au/forms-and-instructions/bas-p-annual-gst-return',
    availability: 'PDF',
    description: 'NAT 4646 - Annual GST return'
  },
  
  // PAYG Forms
  'PAYG Withholding': {
    url: 'https://www.ato.gov.au/business/payg-withholding/',
    availability: 'ONLINE_ONLY',
    description: 'Lodge via Single Touch Payroll',
    portalUrl: 'https://www.ato.gov.au/business/single-touch-payroll/'
  },
  'PAYG Summary': {
    url: 'https://www.ato.gov.au/business/single-touch-payroll/',
    availability: 'ONLINE_ONLY',
    description: 'Automated via Single Touch Payroll'
  },
  
  // Other ATO Forms
  'TFN Declaration': {
    url: 'https://www.ato.gov.au/forms-and-instructions/tfn-declaration/',
    availability: 'PDF',
    description: 'Tax file number declaration form'
  },
  'ABN Application': {
    url: 'https://www.abr.gov.au/business-super-funds-charities/applying-abn',
    availability: 'ONLINE_ONLY',
    description: 'Apply online via ABR',
    portalUrl: 'https://www.abr.gov.au/'
  },
  'Tax Return': {
    url: 'https://www.ato.gov.au/individuals/lodging-your-tax-return/',
    availability: 'ONLINE_ONLY',
    description: 'Lodge via myTax',
    portalUrl: 'https://my.gov.au/'
  },
  
  // AUSTRAC Forms - All require login
  'TTR': {
    url: 'https://www.austrac.gov.au/business/core-guidance/reporting/reporting-transactions-10000-and-over-threshold-transaction-reports-ttrs',
    availability: 'LOGIN_REQUIRED',
    description: 'Must submit via AUSTRAC Online within 10 business days',
    portalUrl: 'https://online.austrac.gov.au/'
  },
  'AUSTRAC TTR': {
    url: 'https://www.austrac.gov.au/business/core-guidance/reporting/reporting-transactions-10000-and-over-threshold-transaction-reports-ttrs',
    availability: 'LOGIN_REQUIRED',
    description: 'Threshold Transaction Report - $10,000+ cash',
    portalUrl: 'https://online.austrac.gov.au/'
  },
  
  // State Forms
  'Payroll Tax': {
    url: 'https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/payroll-tax',
    availability: 'ONLINE_ONLY',
    description: 'Lodge via state revenue office',
    portalUrl: 'https://www.revenue.nsw.gov.au/help-centre/online-services'
  }
}

// Legacy support - map to form info URLs
const FORM_URLS: Record<string, string> = Object.entries(FORM_INFO).reduce((acc, [key, info]) => {
  acc[key] = info.url
  return acc
}, {} as Record<string, string>)

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

// Get form information
export function getFormInfo(formNumber: string): FormInfo | null {
  return FORM_INFO[formNumber] || null
}

// Download or redirect to form
export async function downloadForm(formNumber: string): Promise<void> {
  const formInfo = getFormInfo(formNumber)
  
  if (!formInfo) {
    // Fallback to ATO forms search
    window.open(`https://www.ato.gov.au/forms-and-instructions?search=${encodeURIComponent(formNumber)}`, '_blank')
    return
  }
  
  // Handle different availability types
  switch (formInfo.availability) {
    case 'PDF':
      // Direct to form page (user can download PDF from there)
      window.open(formInfo.url, '_blank')
      break
      
    case 'ONLINE_ONLY':
      // Redirect to portal or online service
      if (formInfo.portalUrl) {
        window.open(formInfo.portalUrl, '_blank')
      } else {
        window.open(formInfo.url, '_blank')
      }
      break
      
    case 'LOGIN_REQUIRED':
      // Show alert then redirect to portal
      alert(`${formNumber} requires login to ${formInfo.description}. You'll be redirected to the portal.`)
      if (formInfo.portalUrl) {
        window.open(formInfo.portalUrl, '_blank')
      } else {
        window.open(formInfo.url, '_blank')
      }
      break
  }
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