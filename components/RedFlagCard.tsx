import React, { useState } from 'react'
import { RedFlag, calculateDaysUntilDeadline, getSeverityColor } from '@/utils/types/analysis'
import { AlertTriangle, Clock, DollarSign, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { downloadForm } from '@/utils/formService'

interface RedFlagCardProps {
  flag: RedFlag
  index: number
}

export default function RedFlagCard({ flag, index }: RedFlagCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const severityColors = {
    LOW: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    MEDIUM: 'bg-orange-50 border-orange-200 text-orange-800',
    HIGH: 'bg-red-50 border-red-200 text-red-800',
    CRITICAL: 'bg-red-100 border-red-300 text-red-900'
  }

  const severityDots = {
    LOW: 'bg-yellow-400',
    MEDIUM: 'bg-orange-400',
    HIGH: 'bg-red-400',
    CRITICAL: 'bg-red-600'
  }

  const severityIcons = {
    LOW: '⚠️',
    MEDIUM: '🚨',
    HIGH: '🔥',
    CRITICAL: '💀'
  }

  const daysUntilDeadline = calculateDaysUntilDeadline(flag.fix.deadline)
  const isOverdue = daysUntilDeadline < 0
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline >= 0

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-200 ${severityColors[flag.severity]} ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-700">#{index}</span>
            <div className={`w-3 h-3 rounded-full ${severityDots[flag.severity]}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-lg">{flag.issue}</h4>
              <span className="text-2xl">{severityIcons[flag.severity]}</span>
            </div>
            
            <p className="text-sm opacity-90 mb-2">{flag.taxCodeViolation}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/70 px-2 py-1 rounded font-medium">
                {flag.type.replace(/_/g, ' ')}
              </span>
              <span className={`px-2 py-1 rounded font-medium ${
                flag.severity === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                flag.severity === 'HIGH' ? 'bg-orange-200 text-orange-800' :
                flag.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                'bg-green-200 text-green-800'
              }`}>
                {flag.severity}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      
      {/* Original Text Quote */}
      {flag.originalText && (
        <div className="bg-white/50 rounded-lg p-3 mb-4 border-l-4 border-gray-400">
          <p className="text-sm font-mono italic">"{flag.originalText}"</p>
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Penalty Amount */}
        <div className="bg-white/70 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-red-600" />
            <p className="text-sm font-semibold text-gray-700">Potential Penalty</p>
          </div>
          <p className="text-xl font-bold text-red-600">
            ${flag.penalty.amount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">{flag.penalty.calculation}</p>
        </div>
        
        {/* Deadline */}
        <div className="bg-white/70 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-semibold text-gray-700">Fix Deadline</p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            {new Date(flag.fix.deadline).toLocaleDateString()}
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

        {/* Legal Reference */}
        <div className="bg-white/70 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-600" />
            <p className="text-sm font-semibold text-gray-700">Legal Basis</p>
          </div>
          <p className="text-sm font-medium text-purple-600">
            {flag.penalty.statutory}
          </p>
          <p className="text-xs text-gray-600 mt-1">Statutory reference</p>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/50 pt-4 space-y-4">
          {/* Detailed Fix Action */}
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-600">🛠️</span>
              How to Fix This Issue
            </h5>
            <p className="text-sm text-gray-700 mb-3">{flag.fix.action}</p>
            
            {flag.fix.form && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => downloadForm(flag.fix.form!)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Download {flag.fix.form}
                  <ExternalLink className="w-3 h-3" />
                </button>
                <span className="text-xs text-gray-600">Required form for compliance</span>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Risk Assessment
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-1">Audit Trigger Level:</p>
                <p className={`font-semibold ${
                  flag.severity === 'CRITICAL' ? 'text-red-600' :
                  flag.severity === 'HIGH' ? 'text-orange-600' :
                  flag.severity === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {flag.severity === 'CRITICAL' ? 'Immediate audit risk' :
                   flag.severity === 'HIGH' ? 'High audit probability' :
                   flag.severity === 'MEDIUM' ? 'Moderate concern' :
                   'Low priority issue'}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Enforcement History:</p>
                <p className="text-gray-600">
                  {flag.type === 'CASH_THRESHOLD' ? 'Heavily monitored - 85% audit rate' :
                   flag.type === 'MISSING_REPORT' ? 'Automatic penalties - 95% enforcement' :
                   flag.type === 'GST_MISMATCH' ? 'Cross-referenced with suppliers' :
                   'Regular compliance checks'}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-blue-600">📋</span>
              Immediate Next Steps
            </h5>
            <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700">
              <li>Review the flagged transaction or document</li>
              <li>Gather supporting documentation</li>
              <li>{flag.fix.action}</li>
              {flag.fix.form && <li>File {flag.fix.form} by {new Date(flag.fix.deadline).toLocaleDateString()}</li>}
              <li>Monitor for confirmation of compliance</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
} 