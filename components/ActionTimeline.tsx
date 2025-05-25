import React from 'react'
import { Recommendation } from '@/utils/types/analysis'
import { Clock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

interface ActionTimelineProps {
  recommendations: Recommendation[]
}

export default function ActionTimeline({ recommendations }: ActionTimelineProps) {
  const priorityOrder = ['IMMEDIATE', 'URGENT', 'MEDIUM', 'LOW']
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  })

  const priorityColors = {
    IMMEDIATE: 'bg-red-50 border-red-200 text-red-800',
    URGENT: 'bg-orange-50 border-orange-200 text-orange-800',
    MEDIUM: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    LOW: 'bg-green-50 border-green-200 text-green-800'
  }

  const priorityDots = {
    IMMEDIATE: 'bg-red-500',
    URGENT: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500'
  }

  const priorityIcons = {
    IMMEDIATE: '🔥',
    URGENT: '⚡',
    MEDIUM: '📋',
    LOW: '📝'
  }

  const difficultyColors = {
    EASY: 'text-green-600 bg-green-100',
    MODERATE: 'text-yellow-600 bg-yellow-100',
    COMPLEX: 'text-red-600 bg-red-100'
  }

  const difficultyIcons = {
    EASY: '✅',
    MODERATE: '⚠️',
    COMPLEX: '🔧'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Clock className="text-blue-500" />
        Action Timeline & Recommendations ({recommendations.length})
      </h3>

      <div className="space-y-4">
        {sortedRecommendations.map((rec, index) => (
          <div
            key={index}
            className={`rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-4">
              {/* Priority Indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full ${priorityDots[rec.priority]} flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                {index < sortedRecommendations.length - 1 && (
                  <div className="w-px h-16 bg-gray-300 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                  <div className="flex items-center gap-3 mb-2 lg:mb-0">
                    <span className="text-xl">{priorityIcons[rec.priority]}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityColors[rec.priority]} border-2`}>
                      {rec.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[rec.difficulty]}`}>
                      {difficultyIcons[rec.difficulty]} {rec.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{rec.estimatedTime}</span>
                    </div>
                    {rec.professionalRequired && (
                      <div className="flex items-center gap-1 text-purple-600">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium">Professional Required</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action and Reason */}
                <div className="mb-3">
                  <h4 className="font-bold text-lg mb-2">{rec.action}</h4>
                  <p className="text-sm opacity-90">{rec.reason}</p>
                </div>

                {/* Deadline */}
                {rec.deadline && (
                  <div className="bg-white/50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Target Completion:</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {new Date(rec.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Professional Help Notice */}
                {rec.professionalRequired && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Professional Assistance Recommended</p>
                        <p className="text-xs text-purple-600 mt-1">
                          This action requires expertise in tax law or compliance. Consider consulting a qualified professional.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Started
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {recommendations.filter(r => r.priority === 'IMMEDIATE').length}
            </div>
            <div className="text-xs text-gray-600">Immediate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {recommendations.filter(r => r.priority === 'URGENT').length}
            </div>
            <div className="text-xs text-gray-600">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {recommendations.filter(r => r.difficulty === 'EASY').length}
            </div>
            <div className="text-xs text-gray-600">Easy Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {recommendations.filter(r => r.professionalRequired).length}
            </div>
            <div className="text-xs text-gray-600">Need Expert</div>
          </div>
        </div>
      </div>

      {/* Estimated Total Time */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Estimated Total Time:</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {/* Simple time estimation - would be more sophisticated in production */}
            {recommendations.length * 2} - {recommendations.length * 4} hours
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Time estimates vary based on document complexity and professional availability
        </p>
      </div>
    </div>
  )
} 