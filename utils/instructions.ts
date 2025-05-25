import { RedFlag, RequiredForm, Recommendation } from './types/analysis'

export interface DetailedInstructions {
  problem: string
  penalty: string
  deadline: string
  daysLeft: number
  urgencyLevel: 'OVERDUE' | 'URGENT' | 'WARNING' | 'OK'
  steps: {
    number: number
    action: string
    description: string
    timeRequired: string
    downloadLink?: string
    onlineFilingUrl?: string
  }[]
  commonMistakes: string[]
  helpPhone: string
  helpCost: string
}

export function generateDetailedInstructions(
  item: RedFlag | RequiredForm | Recommendation, 
  type: 'RED_FLAG' | 'FORM' | 'RECOMMENDATION'
): DetailedInstructions {
  
  const now = new Date()
  const deadline = getDeadlineFromItem(item)
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const urgencyLevel = getUrgencyLevel(daysLeft)
  
  if (type === 'RED_FLAG') {
    return generateRedFlagInstructions(item as RedFlag, daysLeft, urgencyLevel)
  } else if (type === 'FORM') {
    return generateFormInstructions(item as RequiredForm, daysLeft, urgencyLevel)
  } else {
    return generateRecommendationInstructions(item as Recommendation, daysLeft, urgencyLevel)
  }
}

function getDeadlineFromItem(item: RedFlag | RequiredForm | Recommendation): Date {
  if ('fix' in item && item.fix.deadline) {
    return new Date(item.fix.deadline)
  } else if ('deadline' in item && item.deadline) {
    return new Date(item.deadline)
  } else {
    // Default deadline if none specified
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}

function getUrgencyLevel(daysLeft: number): 'OVERDUE' | 'URGENT' | 'WARNING' | 'OK' {
  if (daysLeft < 0) return 'OVERDUE'
  if (daysLeft <= 3) return 'URGENT'
  if (daysLeft <= 7) return 'WARNING'
  return 'OK'
}

function generateRedFlagInstructions(flag: RedFlag, daysLeft: number, urgencyLevel: string): DetailedInstructions {
  const penalty = flag.penalty.amount
  const deadline = new Date(flag.fix.deadline)
  
  return {
    problem: `⚠️ PROBLEM: ${flag.issue}`,
    penalty: `💸 PENALTY IF IGNORED: $${penalty.toLocaleString()} fine`,
    deadline: `📅 DEADLINE: ${deadline.toLocaleDateString()} (${Math.abs(daysLeft)} ${daysLeft < 0 ? 'days overdue' : 'days left'})`,
    daysLeft,
    urgencyLevel: urgencyLevel as any,
    steps: generateRedFlagSteps(flag),
    commonMistakes: getCommonMistakes(flag.type),
    helpPhone: '13 28 61',
    helpCost: '$99 for 30 minutes'
  }
}

function generateFormInstructions(form: RequiredForm, daysLeft: number, urgencyLevel: string): DetailedInstructions {
  const deadline = new Date(form.deadline)
  
  return {
    problem: `📋 FORM REQUIRED: ${form.formNumber} - ${form.name}`,
    penalty: `💸 PENALTY IF LATE: $${form.penalty.toLocaleString()}`,
    deadline: `📅 DEADLINE: ${deadline.toLocaleDateString()} (${Math.abs(daysLeft)} ${daysLeft < 0 ? 'days overdue' : 'days left'})`,
    daysLeft,
    urgencyLevel: urgencyLevel as any,
    steps: generateFormSteps(form),
    commonMistakes: getFormCommonMistakes(form.formNumber),
    helpPhone: '13 28 61',
    helpCost: '$99 for 30 minutes'
  }
}

function generateRecommendationInstructions(rec: Recommendation, daysLeft: number, urgencyLevel: string): DetailedInstructions {
  const deadline = rec.deadline ? new Date(rec.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  return {
    problem: `🎯 ACTION REQUIRED: ${rec.action}`,
    penalty: `💸 RISK IF IGNORED: Potential audit and penalties`,
    deadline: `📅 TARGET: ${deadline.toLocaleDateString()} (${Math.abs(daysLeft)} ${daysLeft < 0 ? 'days overdue' : 'days left'})`,
    daysLeft,
    urgencyLevel: urgencyLevel as any,
    steps: generateRecommendationSteps(rec),
    commonMistakes: getRecommendationMistakes(rec.action),
    helpPhone: '13 28 61',
    helpCost: '$99 for 30 minutes'
  }
}

function generateRedFlagSteps(flag: RedFlag): DetailedInstructions['steps'] {
  const steps: DetailedInstructions['steps'] = []
  
  if (flag.type === 'CASH_THRESHOLD') {
    steps.push(
      {
        number: 1,
        action: 'Report to AUSTRAC immediately',
        description: 'Log into AUSTRAC Online to submit Threshold Transaction Report (TTR)',
        timeRequired: '5 minutes',
        onlineFilingUrl: 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online'
      },
      {
        number: 2,
        action: 'Gather transaction details',
        description: 'Collect all information about the cash transaction: date, amount ($10,000+ AUD), customer details, ID verification',
        timeRequired: '15 minutes'
      },
      {
        number: 3,
        action: 'Complete TTR form online',
        description: 'Fill out all required fields in AUSTRAC Online system',
        timeRequired: '20 minutes'
      },
      {
        number: 4,
        action: 'Submit within 10 business days',
        description: 'Must be reported within 10 business days or face penalties up to $222,000',
        timeRequired: '2 minutes',
        onlineFilingUrl: 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online'
      }
    )
  } else if (flag.type === 'GST_MISMATCH') {
    steps.push(
      {
        number: 1,
        action: 'Review GST calculations',
        description: 'Check all GST amounts claimed against actual invoices and receipts',
        timeRequired: '30 minutes'
      },
      {
        number: 2,
        action: 'Prepare amended return',
        description: 'Correct any errors in your GST return using the proper forms',
        timeRequired: '45 minutes'
      },
      {
        number: 3,
        action: 'Submit voluntary disclosure',
        description: 'File the correction before ATO contacts you to reduce penalties',
        timeRequired: '15 minutes'
      }
    )
  } else {
    // Generic steps for other red flag types
    steps.push(
      {
        number: 1,
        action: 'Review the issue',
        description: flag.fix.action,
        timeRequired: '15 minutes'
      },
      {
        number: 2,
        action: 'Gather supporting documents',
        description: 'Collect all relevant paperwork and evidence',
        timeRequired: '30 minutes'
      },
      {
        number: 3,
        action: 'Take corrective action',
        description: 'Follow the specific fix outlined for your situation',
        timeRequired: '45 minutes'
      }
    )
  }
  
  return steps
}

function generateFormSteps(form: RequiredForm): DetailedInstructions['steps'] {
  const steps: DetailedInstructions['steps'] = [
    {
      number: 1,
      action: `Download ${form.formNumber}`,
      description: `Get the latest version of ${form.formNumber} - ${form.name}`,
      timeRequired: '2 minutes',
      downloadLink: form.downloadUrl || `/forms/${form.formNumber.toLowerCase().replace(' ', '-')}.pdf`
    },
    {
      number: 2,
      action: 'Gather required information',
      description: 'Collect all necessary documents and data needed to complete the form',
      timeRequired: '20 minutes'
    },
    {
      number: 3,
      action: 'Complete the form',
      description: 'Fill out all required fields accurately using the gathered information',
      timeRequired: '30 minutes'
    }
  ]
  
  if (form.filingMethod === 'ONLINE' || form.filingMethod === 'BOTH') {
    steps.push({
      number: 4,
      action: 'File online',
      description: 'Submit the completed form through the official online portal',
      timeRequired: '10 minutes',
      onlineFilingUrl: getOnlineFilingUrl(form.formNumber)
    })
  } else {
    steps.push({
      number: 4,
      action: 'Mail the form',
      description: 'Print, sign, and mail the completed form to the correct address',
      timeRequired: '15 minutes'
    })
  }
  
  steps.push({
    number: 5,
    action: 'Keep confirmation',
    description: 'Save the confirmation number or receipt for your records',
    timeRequired: '2 minutes'
  })
  
  return steps
}

function generateRecommendationSteps(rec: Recommendation): DetailedInstructions['steps'] {
  // Break down the recommendation action into specific steps
  const actionParts = rec.action.split('. ')
  
  return actionParts.map((part, index) => ({
    number: index + 1,
    action: part.trim(),
    description: `Complete this step to address the compliance issue`,
    timeRequired: rec.estimatedTime
  }))
}

function getCommonMistakes(flagType: string): string[] {
  const mistakes: Record<string, string[]> = {
    'CASH_THRESHOLD': [
      'Not reporting within 10 business days to AUSTRAC',
      'Failing to verify customer ID (100 point check)',
      'Reporting amounts below $10,000 AUD threshold',
      'Not keeping required records for 7 years'
    ],
    'GST_MISMATCH': [
      'Not keeping proper GST records',
      'Claiming GST on exempt items',
      'Incorrect calculation of input tax credits',
      'Late lodgement of BAS statements'
    ],
    'MISSING_REPORT': [
      'Assuming the report isn\'t required',
      'Filing the wrong form for your situation',
      'Missing supporting documentation',
      'Not updating address details'
    ]
  }
  
  return mistakes[flagType] || [
    'Not acting quickly enough',
    'Incomplete documentation',
    'Filing the wrong forms',
    'Not seeking professional help when needed'
  ]
}

function getFormCommonMistakes(formNumber: string): string[] {
  const mistakes: Record<string, string[]> = {
    'BAS': [
      'Missing the 28th of month deadline',
      'Incorrect GST calculations',
      'Wrong PAYG withholding amounts',
      'Not reporting all business income'
    ],
    'TTR': [
      'Not reporting within 10 business days',
      'Missing customer ID verification',
      'Incorrect transaction details',
      'Not using AUSTRAC Online'
    ],
    'AUSTRAC TTR': [
      'Delaying report beyond 10 business days',
      'Incomplete customer information',
      'Wrong transaction amount',
      'Not keeping verification records'
    ]
  }
  
  return mistakes[formNumber] || [
    'Missing deadlines',
    'Incomplete information',
    'Mathematical errors',
    'Wrong form version'
  ]
}

function getRecommendationMistakes(action: string): string[] {
  return [
    'Delaying action until it\'s too late',
    'Not keeping proper records',
    'Assuming the issue will resolve itself',
    'Not getting professional help for complex issues'
  ]
}

function getOnlineFilingUrl(formNumber: string): string {
  const urls: Record<string, string> = {
    'BAS': 'https://www.ato.gov.au/business/business-activity-statements-bas/lodging-and-paying-your-bas/',
    'TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online',
    'AUSTRAC TTR': 'https://www.austrac.gov.au/business/how-comply-and-report-guidance-and-resources/reporting/austrac-online',
    'PAYG Summary': 'https://www.ato.gov.au/business/single-touch-payroll/',
    'Tax Return': 'https://my.gov.au/'
  }
  
  return urls[formNumber] || 'https://www.ato.gov.au/lodgment'
} 