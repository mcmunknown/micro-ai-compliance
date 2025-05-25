import React, { useState, useEffect } from 'react'
import { ScanMetadata, ensureDate } from '@/utils/types/analysis'
import { TrendingUp, TrendingDown, Calendar, FileText, AlertTriangle, DollarSign, BarChart3, Filter } from 'lucide-react'
import AuditRiskGauge from './AuditRiskGauge'

interface ScanHistoryProps {
  userId: string
}

interface ComplianceTrends {
  averageRiskScore: number
  riskTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
  totalScans: number
  avgRedFlags: number
  avgComplianceScore: number
}

export default function ScanHistory({ userId }: ScanHistoryProps) {
  const [scanHistory, setScanHistory] = useState<ScanMetadata[]>([])
  const [trends, setTrends] = useState<ComplianceTrends | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'type'>('date')

  useEffect(() => {
    loadScanHistory()
    loadComplianceTrends()
  }, [userId, selectedPeriod])

  const loadScanHistory = async () => {
    try {
      setLoading(true)
      // In a real app, this would call an API endpoint
      // For now, we'll simulate the data
      const mockHistory: ScanMetadata[] = [
        {
          id: 'scan_1',
          userId,
          documentName: 'Annual_Tax_Return_2023.pdf',
          scanType: 'ultra',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          riskScore: 75,
          redFlagsCount: 3,
          complianceScore: 82,
          estimatedPenalties: 15000
        },
        {
          id: 'scan_2',
          userId,
          documentName: 'Q3_Financial_Statements.csv',
          scanType: 'deep',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          riskScore: 45,
          redFlagsCount: 1,
          complianceScore: 91,
          estimatedPenalties: 2500
        },
        {
          id: 'scan_3',
          userId,
          documentName: 'Invoice_Template.pdf',
          scanType: 'basic',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          riskScore: 25,
          redFlagsCount: 0,
          complianceScore: 95,
          estimatedPenalties: 0
        }
      ]
      setScanHistory(mockHistory)
    } catch (error) {
      console.error('Failed to load scan history:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadComplianceTrends = async () => {
    try {
      // Mock trends data
      const mockTrends: ComplianceTrends = {
        averageRiskScore: 48,
        riskTrend: 'IMPROVING',
        totalScans: 12,
        avgRedFlags: 1.3,
        avgComplianceScore: 89
      }
      setTrends(mockTrends)
    } catch (error) {
      console.error('Failed to load compliance trends:', error)
    }
  }

  const filteredHistory = scanHistory.filter(scan => {
    const timestamp = ensureDate(scan.timestamp)
    const daysAgo = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
    switch (selectedPeriod) {
      case '7d': return daysAgo <= 7
      case '30d': return daysAgo <= 30
      case '90d': return daysAgo <= 90
      default: return true
    }
  })

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case 'date': {
        const timestampA = ensureDate(a.timestamp)
        const timestampB = ensureDate(b.timestamp)
        return timestampB.getTime() - timestampA.getTime()
      }
      case 'risk': return b.riskScore - a.riskScore
      case 'type': return a.scanType.localeCompare(b.scanType)
      default: return 0
    }
  })

  const getRiskColor = (score: number) => {
    if (score < 25) return 'text-green-600 bg-green-50'
    if (score < 50) return 'text-yellow-600 bg-yellow-50'
    if (score < 75) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getScanTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'deep': return 'bg-purple-100 text-purple-800'
      case 'ultra': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING': return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'DECLINING': return <TrendingDown className="w-5 h-5 text-red-500" />
      default: return <BarChart3 className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Loading scan history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Compliance Dashboard
        </h2>
        <p className="text-gray-600">Track your compliance progress and audit risk trends</p>
      </div>

      {/* Compliance Trends Overview */}
      {trends && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            {getTrendIcon(trends.riskTrend)}
            Compliance Trends
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Average Risk Score */}
            <div className="text-center">
              <AuditRiskGauge score={trends.averageRiskScore} size="sm" />
              <p className="text-sm text-gray-600 mt-2 font-medium">Avg Risk Score</p>
            </div>
            
            {/* Risk Trend */}
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                trends.riskTrend === 'IMPROVING' ? 'bg-green-100' :
                trends.riskTrend === 'DECLINING' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {getTrendIcon(trends.riskTrend)}
              </div>
              <p className={`text-sm font-bold ${
                trends.riskTrend === 'IMPROVING' ? 'text-green-600' :
                trends.riskTrend === 'DECLINING' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trends.riskTrend}
              </p>
              <p className="text-xs text-gray-600">Trend</p>
            </div>

            {/* Total Scans */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{trends.totalScans}</div>
              <p className="text-sm text-gray-600">Total Scans</p>
            </div>

            {/* Average Red Flags */}
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{trends.avgRedFlags}</div>
              <p className="text-sm text-gray-600">Avg Red Flags</p>
            </div>

            {/* Compliance Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{trends.avgComplianceScore}%</div>
              <p className="text-sm text-gray-600">Compliance</p>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">📈 Analysis</h4>
            <p className="text-sm text-gray-700">
              {trends.riskTrend === 'IMPROVING' 
                ? `Great progress! Your compliance has improved over time with an average risk reduction. Keep implementing the recommended actions.`
                : trends.riskTrend === 'DECLINING'
                ? `Your compliance scores show a declining trend. Consider scheduling a consultation to address emerging risks.`
                : `Your compliance performance is stable. Regular monitoring will help maintain your current standards.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-purple-500" />
            Scan History ({filteredHistory.length})
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="risk">Sort by Risk</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scan History List */}
      <div className="space-y-4">
        {sortedHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No scans found</h3>
            <p className="text-gray-500">Upload your first document to start tracking compliance</p>
          </div>
        ) : (
          sortedHistory.map((scan) => (
            <div key={scan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Scan Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{scan.documentName}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScanTypeColor(scan.scanType)}`}>
                        {scan.scanType.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Scanned on {ensureDate(scan.timestamp).toLocaleDateString()} at {ensureDate(scan.timestamp).toLocaleTimeString()}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                        <div className={`text-lg font-bold px-2 py-1 rounded ${getRiskColor(scan.riskScore)}`}>
                          {scan.riskScore}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Red Flags</p>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="font-bold text-red-600">{scan.redFlagsCount}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Compliance</p>
                        <div className="text-lg font-bold text-green-600">{scan.complianceScore}%</div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Potential Penalties</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-orange-500" />
                          <span className="font-bold text-orange-600">
                            ${scan.estimatedPenalties.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-32">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Re-analyze
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {filteredHistory.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">📊 Period Summary</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(filteredHistory.reduce((sum, scan) => sum + scan.riskScore, 0) / filteredHistory.length)}
              </div>
              <div className="text-xs text-blue-700">Avg Risk Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {filteredHistory.reduce((sum, scan) => sum + scan.redFlagsCount, 0)}
              </div>
              <div className="text-xs text-red-700">Total Red Flags</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(filteredHistory.reduce((sum, scan) => sum + scan.complianceScore, 0) / filteredHistory.length)}%
              </div>
              <div className="text-xs text-green-700">Avg Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                ${filteredHistory.reduce((sum, scan) => sum + scan.estimatedPenalties, 0).toLocaleString()}
              </div>
              <div className="text-xs text-orange-700">Total Risk Exposure</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 