import React from 'react'
import { AuditAnalysisResult } from '@/utils/types/analysis'
import { AlertTriangle, FileText, Calendar, DollarSign, Clock, Shield, TrendingUp, CheckCircle } from 'lucide-react'
import AuditRiskGauge from './AuditRiskGauge'
import RedFlagCard from './RedFlagCard'
import ActionTimeline from './ActionTimeline'
import RequiredFormsSection from './RequiredFormsSection'

interface AnalysisResultsProps {
  result: AuditAnalysisResult
  scanType: string
  scanId: string
  timestamp: string
}

export default function AnalysisResults({ 
  result, 
  scanType, 
  scanId, 
  timestamp 
}: AnalysisResultsProps) {
  const riskLevelColors = {
    LOW: 'text-green-600 bg-green-50 border-green-200',
    MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
    CRITICAL: 'text-red-600 bg-red-50 border-red-200'
  }

  const riskLevelEmojis = {
    LOW: '✅',
    MEDIUM: '⚠️',
    HIGH: '🚨',
    CRITICAL: '🔥'
  }

  return (
    <div className="space-y-6">
      {/* Header with Scan Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <div className="flex items-center gap-3 mb-3 lg:mb-0">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Audit Risk Analysis Report
              </h2>
              <p className="text-sm text-gray-600">
                Scan ID: {scanId} • {new Date(timestamp).toLocaleString()} • {scanType.toUpperCase()} scan
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${riskLevelColors[result.summary.riskLevel]}`}>
            {riskLevelEmojis[result.summary.riskLevel]} {result.summary.riskLevel} RISK
          </div>
        </div>
      </div>

      {/* Risk Score Dashboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="text-blue-500" />
          Risk Assessment Dashboard
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Audit Risk Gauge */}
          <div className="col-span-2 lg:col-span-1 text-center">
            <AuditRiskGauge score={result.summary.auditRiskScore} />
            <p className="text-sm text-gray-600 mt-2 font-medium">Audit Risk Score</p>
          </div>
          
          {/* Probability */}
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-red-600 mb-1">
              {result.summary.auditProbability}
            </p>
            <p className="text-sm text-gray-600">Audit Probability</p>
          </div>
          
          {/* Estimated Penalties */}
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-xl lg:text-2xl font-bold text-orange-600 mb-1">
              ${result.summary.estimatedPenalties.likely.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Likely Penalties</p>
            <p className="text-xs text-gray-500 mt-1">
              Range: ${result.summary.estimatedPenalties.minimum.toLocaleString()} - ${result.summary.estimatedPenalties.maximum.toLocaleString()}
            </p>
          </div>
          
          {/* Compliance Score */}
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
              {result.summary.complianceScore}%
            </p>
            <p className="text-sm text-gray-600">Compliance Score</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-bold text-lg">{result.redFlags.length}</span>
              </div>
              <p className="text-xs text-gray-600">Red Flags</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-lg">{result.recommendations.length}</span>
              </div>
              <p className="text-xs text-gray-600">Recommendations</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="font-bold text-lg">{result.requiredForms?.length || 0}</span>
              </div>
              <p className="text-xs text-gray-600">Required Forms</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-bold text-lg">
                  {result.recommendations.filter(r => r.priority === 'IMMEDIATE').length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Urgent Actions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      {result.redFlags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Critical Red Flags ({result.redFlags.length})
          </h3>
          <div className="space-y-4">
            {result.redFlags.map((flag, idx) => (
              <RedFlagCard key={flag.id} flag={flag} index={idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Action Timeline */}
      {result.recommendations.length > 0 && (
        <ActionTimeline recommendations={result.recommendations} />
      )}
      
      {/* Required Forms */}
      {result.requiredForms && result.requiredForms.length > 0 && (
        <RequiredFormsSection forms={result.requiredForms} />
      )}

      {/* Next Steps Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          Next Steps Summary
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <div>
            <h4 className="font-semibold text-red-600 mb-3">🚨 Immediate Actions (Next 7 Days)</h4>
            <ul className="space-y-2">
              {result.recommendations
                .filter(rec => rec.priority === 'IMMEDIATE')
                .slice(0, 3)
                .map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{rec.action}</span>
                  </li>
                ))}
              {result.recommendations.filter(rec => rec.priority === 'IMMEDIATE').length === 0 && (
                <li className="text-sm text-gray-600 italic">No immediate actions required</li>
              )}
            </ul>
          </div>

          {/* Long-term Improvements */}
          <div>
            <h4 className="font-semibold text-blue-600 mb-3">📈 Long-term Improvements</h4>
            <ul className="space-y-2">
              {result.recommendations
                .filter(rec => rec.priority === 'MEDIUM' || rec.priority === 'LOW')
                .slice(0, 3)
                .map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec.action}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Professional Help Recommendation */}
        {result.recommendations.some(rec => rec.professionalRequired) && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👨‍💼</span>
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Professional Assistance Recommended</h4>
                <p className="text-sm text-amber-700">
                  Some issues identified require professional tax or legal expertise. 
                  Consider consulting with a qualified tax professional or attorney.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 text-center">
        <p>
          ⚠️ This analysis is for informational purposes only and does not constitute legal or tax advice. 
          Always consult with qualified professionals for specific guidance on your tax situation.
        </p>
      </div>
    </div>
  )
} 