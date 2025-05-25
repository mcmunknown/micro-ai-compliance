import React from 'react'
import { RequiredForm, calculateDaysUntilDeadline, ensureDate } from '@/utils/types/analysis'
import { FileText, Calendar, DollarSign, Download, AlertTriangle, ExternalLink, Globe } from 'lucide-react'

interface RequiredFormsSectionProps {
  forms: RequiredForm[]
}

export default function RequiredFormsSection({ forms }: RequiredFormsSectionProps) {
  const sortedForms = [...forms].sort((a, b) => {
    const dateA = ensureDate(a.deadline)
    const dateB = ensureDate(b.deadline)
    return dateA.getTime() - dateB.getTime()
  })

  const getFilingMethodIcon = (method: string) => {
    switch (method) {
      case 'ONLINE': return <Globe className="w-4 h-4 text-green-600" />
      case 'PAPER': return <FileText className="w-4 h-4 text-blue-600" />
      case 'BOTH': return <div className="flex gap-1">
        <Globe className="w-3 h-3 text-green-600" />
        <FileText className="w-3 h-3 text-blue-600" />
      </div>
      default: return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600 bg-red-50 border-red-200'
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (daysLeft <= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="text-purple-500" />
        Required Forms & Filings ({forms.length})
      </h3>

      <div className="space-y-4">
        {sortedForms.map((form, index) => {
          const daysUntilDeadline = calculateDaysUntilDeadline(form.deadline)
          const isOverdue = daysUntilDeadline < 0
          const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline >= 0

          return (
            <div
              key={index}
              className={`rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md ${getUrgencyColor(daysUntilDeadline)}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Form Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{form.formNumber}</h4>
                        {(isOverdue || isUrgent) && (
                          <span className="animate-pulse">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </span>
                        )}
                      </div>
                      
                      <h5 className="font-semibold text-gray-800 mb-2">{form.name}</h5>
                      <p className="text-sm opacity-90 mb-3">{form.description}</p>

                      {/* Key Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Deadline */}
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Due Date</span>
                          </div>
                          <p className="font-bold text-blue-600">
                            {ensureDate(form.deadline).toLocaleDateString()}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isOverdue ? 'text-red-600 font-semibold' :
                            isUrgent ? 'text-orange-600 font-semibold' :
                            'text-gray-600'
                          }`}>
                            {isOverdue ? `${Math.abs(daysUntilDeadline)} days overdue` :
                             isUrgent ? `${daysUntilDeadline} days left` :
                             `${daysUntilDeadline} days remaining`}
                          </p>
                        </div>

                        {/* Penalty */}
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium">Penalty</span>
                          </div>
                          <p className="font-bold text-red-600">
                            ${form.penalty.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {isOverdue ? 'Plus interest' : 'If filed late'}
                          </p>
                        </div>

                        {/* Filing Method */}
                        <div className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            {getFilingMethodIcon(form.filingMethod)}
                            <span className="text-sm font-medium">Filing Method</span>
                          </div>
                          <p className="font-bold text-gray-700">
                            {form.filingMethod === 'BOTH' ? 'Online or Paper' : form.filingMethod}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {form.filingMethod === 'ONLINE' ? 'E-filing available' :
                             form.filingMethod === 'PAPER' ? 'Mail submission' :
                             'Choose preferred method'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 lg:w-48">
                  {form.downloadUrl ? (
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      Download Form
                    </button>
                  ) : (
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Get Form Online
                    </button>
                  )}

                  {form.prefillData && Object.keys(form.prefillData).length > 0 && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                      <FileText className="w-4 h-4" />
                      Generate Pre-filled
                    </button>
                  )}

                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Instructions
                  </button>
                </div>
              </div>

              {/* Urgency Alert */}
              {(isOverdue || isUrgent) && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 mb-1">
                        {isOverdue ? 'OVERDUE - Immediate Action Required' : 'URGENT - Filing Due Soon'}
                      </p>
                      <p className="text-sm text-red-700">
                        {isOverdue 
                          ? `This form is ${Math.abs(daysUntilDeadline)} days overdue. File immediately to minimize penalties and interest charges.`
                          : `Only ${daysUntilDeadline} days remaining. Prepare and file this form as soon as possible.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-fill Data Preview */}
              {form.prefillData && Object.keys(form.prefillData).length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h6 className="font-semibold text-blue-800 mb-2">Pre-fill Data Available:</h6>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {Object.keys(form.prefillData).slice(0, 4).map((key, idx) => (
                      <div key={idx} className="bg-white px-2 py-1 rounded">
                        <span className="font-medium text-blue-700">{key}</span>
                      </div>
                    ))}
                    {Object.keys(form.prefillData).length > 4 && (
                      <div className="bg-white px-2 py-1 rounded text-gray-600">
                        +{Object.keys(form.prefillData).length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {forms.filter(f => calculateDaysUntilDeadline(f.deadline) < 0).length}
            </div>
            <div className="text-xs text-gray-600">Overdue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {forms.filter(f => {
                const days = calculateDaysUntilDeadline(f.deadline)
                return days >= 0 && days <= 7
              }).length}
            </div>
            <div className="text-xs text-gray-600">Due This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {forms.filter(f => {
                const days = calculateDaysUntilDeadline(f.deadline)
                return days > 7 && days <= 30
              }).length}
            </div>
            <div className="text-xs text-gray-600">Due This Month</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              ${forms.reduce((sum, f) => sum + f.penalty, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Potential Penalties</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h6 className="font-semibold text-blue-800 mb-1">Need Help Filing?</h6>
            <p className="text-sm text-blue-700 mb-2">
              Our form assistant can help you complete these forms accurately and on time.
            </p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
              Get Filing Assistance →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 