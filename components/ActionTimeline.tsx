import React, { useState, useEffect } from 'react'
import { Recommendation } from '@/utils/types/analysis'
import { Clock, User, AlertCircle, CheckCircle2, ArrowRight, Calendar, DollarSign, Phone, ExternalLink, Download } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { markTaskAsStarted, getTaskProgress, TaskProgress, calculateDaysUntilDeadline, getDeadlineUrgency } from '@/utils/taskProgress'
import { generateDetailedInstructions, DetailedInstructions } from '@/utils/instructions'

interface ActionTimelineProps {
  recommendations: Recommendation[]
}

export default function ActionTimeline({ recommendations }: ActionTimelineProps) {
  const { user } = useAuth()
  const [taskProgress, setTaskProgress] = useState<Record<string, TaskProgress>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})
  const [detailedInstructions, setDetailedInstructions] = useState<Record<string, DetailedInstructions>>({})

  const priorityOrder = ['IMMEDIATE', 'URGENT', 'MEDIUM', 'LOW']
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
  })

  // Load existing progress for all tasks
  useEffect(() => {
    if (!user) return

    const loadProgress = async () => {
      const progressMap: Record<string, TaskProgress> = {}
      
      for (const rec of recommendations) {
        const taskId = `rec_${recommendations.indexOf(rec)}`
        const progress = await getTaskProgress(user.uid, taskId)
        if (progress) {
          progressMap[taskId] = progress
        }
      }
      
      setTaskProgress(progressMap)
    }

    loadProgress()
  }, [user, recommendations])

  const handleViewDetails = (recommendation: Recommendation, index: number) => {
    const taskId = `rec_${index}`
    
    if (showDetails[taskId]) {
      // Hide details
      setShowDetails(prev => ({ ...prev, [taskId]: false }))
    } else {
      // Show details - generate instructions
      const instructions = generateDetailedInstructions(recommendation, 'RECOMMENDATION')
      setDetailedInstructions(prev => ({ ...prev, [taskId]: instructions }))
      setShowDetails(prev => ({ ...prev, [taskId]: true }))
    }
  }

  const handleMarkAsStarted = async (recommendation: Recommendation, index: number) => {
    if (!user) return

    const taskId = `rec_${index}`
    setLoading(prev => ({ ...prev, [taskId]: true }))

    try {
      // Calculate penalty amount based on priority
      const penaltyAmount = getPriorityPenalty(recommendation.priority)
      
      await markTaskAsStarted(user.uid, taskId, {
        title: recommendation.action,
        deadlineDate: recommendation.deadline ? new Date(recommendation.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
        penaltyIfMissed: penaltyAmount,
        taskType: 'RECOMMENDATION',
        nextStep: `Step 1: ${recommendation.action.split('.')[0] || recommendation.action}`
      })

      // Update local state
      const newProgress: TaskProgress = {
        taskId,
        userId: user.uid,
        started: true,
        completed: false,
        lastSaved: new Date(),
        nextStep: `Step 1: ${recommendation.action.split('.')[0] || recommendation.action}`,
        deadlineDate: recommendation.deadline ? new Date(recommendation.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        penaltyIfMissed: penaltyAmount,
        taskType: 'RECOMMENDATION',
        title: recommendation.action,
        startedAt: new Date()
      }

      setTaskProgress(prev => ({ ...prev, [taskId]: newProgress }))
    } catch (error) {
      console.error('Error marking task as started:', error)
      alert('Failed to save progress. Please try again.')
    } finally {
      setLoading(prev => ({ ...prev, [taskId]: false }))
    }
  }

  const getPriorityPenalty = (priority: string): number => {
    switch (priority) {
      case 'IMMEDIATE': return 50000
      case 'URGENT': return 25000
      case 'MEDIUM': return 10000
      case 'LOW': return 5000
      default: return 1000
    }
  }

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
        {sortedRecommendations.map((rec, index) => {
          const taskId = `rec_${index}`
          const progress = taskProgress[taskId]
          const isStarted = progress?.started || false
          const isCompleted = progress?.completed || false
          const isLoading = loading[taskId] || false
          
          // Get deadline info
          const deadline = rec.deadline ? new Date(rec.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          const daysLeft = calculateDaysUntilDeadline(deadline)
          const urgency = getDeadlineUrgency(deadline)
          const penaltyAmount = getPriorityPenalty(rec.priority)

          return (
            <div
              key={index}
              className={`rounded-xl border-2 p-5 transition-all duration-200 hover:shadow-md ${
                isStarted ? 'bg-blue-50 border-blue-200' : priorityColors[rec.priority]
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Progress Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${
                    isCompleted ? 'bg-green-500' : isStarted ? 'bg-blue-500' : priorityDots[rec.priority]
                  } flex items-center justify-center`}>
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
                      {isStarted && !isCompleted && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          IN PROGRESS
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          ✅ COMPLETED
                        </span>
                      )}
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

                  {/* Critical Info Boxes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    {/* Deadline */}
                    <div className={`rounded-lg p-3 ${
                      urgency === 'OVERDUE' ? 'bg-red-100 border border-red-300' :
                      urgency === 'URGENT' ? 'bg-orange-100 border border-orange-300' :
                      urgency === 'WARNING' ? 'bg-yellow-100 border border-yellow-300' :
                      'bg-white/50'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Deadline</span>
                      </div>
                      <p className={`font-bold ${
                        urgency === 'OVERDUE' ? 'text-red-700' :
                        urgency === 'URGENT' ? 'text-orange-700' :
                        urgency === 'WARNING' ? 'text-yellow-700' :
                        'text-blue-600'
                      }`}>
                        {deadline.toLocaleDateString()}
                      </p>
                      <p className={`text-xs mt-1 font-semibold ${
                        urgency === 'OVERDUE' ? 'text-red-600' :
                        urgency === 'URGENT' ? 'text-orange-600' :
                        urgency === 'WARNING' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {urgency === 'OVERDUE' ? `${Math.abs(daysLeft)} days OVERDUE` :
                         urgency === 'URGENT' ? `${daysLeft} days left!` :
                         urgency === 'WARNING' ? `${daysLeft} days left` :
                         `${daysLeft} days remaining`}
                      </p>
                    </div>

                    {/* Penalty */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">Penalty Risk</span>
                      </div>
                      <p className="font-bold text-red-600">
                        ${penaltyAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        If not addressed
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <p className="font-bold text-gray-700">
                        {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {isStarted && progress?.startedAt ? 
                          `Started ${progress.startedAt.toLocaleDateString()}` : 
                          'Ready to begin'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Started Progress Info */}
                  {isStarted && progress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-800 mb-1">
                            Started on {progress.startedAt?.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-blue-700">
                            <strong>Next Step:</strong> {progress.nextStep}
                          </p>
                          <p className="text-sm text-blue-600 mt-1">
                            Progress automatically saved • Continue where you left off
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Urgency Warning */}
                  {(urgency === 'OVERDUE' || urgency === 'URGENT') && (
                    <div className={`p-3 rounded-lg border mb-3 ${
                      urgency === 'OVERDUE' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          urgency === 'OVERDUE' ? 'text-red-500' : 'text-orange-500'
                        }`} />
                        <div>
                          <p className={`font-semibold mb-1 ${
                            urgency === 'OVERDUE' ? 'text-red-800' : 'text-orange-800'
                          }`}>
                            {urgency === 'OVERDUE' ? '🚨 OVERDUE - Act Immediately' : '⚠️ URGENT - Deadline Approaching'}
                          </p>
                          <p className={`text-sm ${
                            urgency === 'OVERDUE' ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            {urgency === 'OVERDUE' 
                              ? `This task is ${Math.abs(daysLeft)} days overdue. Every day of delay increases your penalty risk.`
                              : `Only ${daysLeft} days remaining. Start this task immediately to avoid penalties.`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Professional Help Notice */}
                  {rec.professionalRequired && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
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
                    {!isStarted && (
                      <button 
                        onClick={() => handleMarkAsStarted(rec, index)}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Mark as Started'}
                      </button>
                    )}
                    
                    {isStarted && !isCompleted && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Completed
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleViewDetails(rec, index)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* View Details Expanded Content */}
                  {showDetails[taskId] && detailedInstructions[taskId] && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      {/* Critical Warning Box */}
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                        <div className="space-y-2">
                          <p className="font-bold text-red-800">{detailedInstructions[taskId].problem}</p>
                          <p className="font-bold text-red-700">{detailedInstructions[taskId].penalty}</p>
                          <p className="font-bold text-red-600">{detailedInstructions[taskId].deadline}</p>
                        </div>
                      </div>

                      {/* WHAT TO DO RIGHT NOW */}
                      <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mb-4">
                        <h5 className="font-bold text-lg mb-3 text-blue-800">WHAT TO DO RIGHT NOW:</h5>
                        <div className="space-y-3">
                          {detailedInstructions[taskId].steps.map((step) => (
                            <div key={step.number} className="flex gap-3">
                              <span className="font-bold text-blue-600 flex-shrink-0">{step.number}.</span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{step.action}</p>
                                <p className="text-sm text-gray-600">{step.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Time required: {step.timeRequired}</p>
                                <div className="flex gap-3 mt-2">
                                  {step.downloadLink && (
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center gap-2">
                                      <Download className="w-4 h-4" />
                                      DOWNLOAD FORM
                                    </button>
                                  )}
                                  {step.onlineFilingUrl && (
                                    <button 
                                      onClick={() => window.open(step.onlineFilingUrl, '_blank')}
                                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      FILE ONLINE HERE
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Common Mistakes to Avoid */}
                      {detailedInstructions[taskId].commonMistakes.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <h5 className="font-semibold text-yellow-800 mb-2">⚠️ COMMON MISTAKES TO AVOID:</h5>
                          <ul className="space-y-1">
                            {detailedInstructions[taskId].commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                                <span>•</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Need Help Button */}
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-green-800">IF YOU GET STUCK:</p>
                            <p className="text-sm text-green-700">Call our expert at {detailedInstructions[taskId].helpPhone}</p>
                            <p className="text-xs text-green-600">{detailedInstructions[taskId].helpCost}</p>
                          </div>
                          <button 
                            onClick={() => window.open('tel:132861', '_self')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <Phone className="w-5 h-5" />
                            CALL ATO EXPERT
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
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
              {Object.values(taskProgress).filter(p => p.started && !p.completed).length}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {recommendations.filter(r => r.professionalRequired).length}
            </div>
            <div className="text-xs text-gray-600">Need Expert</div>
          </div>
        </div>
      </div>

      {/* Critical Deadlines Warning */}
      {recommendations.some(rec => {
        const deadline = rec.deadline ? new Date(rec.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const urgency = getDeadlineUrgency(deadline)
        return urgency === 'OVERDUE' || urgency === 'URGENT'
      }) && (
        <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h6 className="font-bold text-red-800 mb-1">🚨 CRITICAL DEADLINES APPROACHING</h6>
              <p className="text-red-700 text-sm mb-2">
                You have overdue or urgent tasks that could result in significant penalties. 
                Take immediate action to protect your business.
              </p>
              <div className="text-xs text-red-600">
                • Start with the highest priority tasks first
                • Consider getting professional help for complex issues
                • Don't wait - every day increases your penalty risk
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Your Progress:</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {Object.values(taskProgress).filter(p => p.completed).length} of {recommendations.length} completed
            </div>
            <div className="text-xs text-blue-600">
              {Object.values(taskProgress).filter(p => p.started && !p.completed).length} in progress
            </div>
          </div>
        </div>
        {Object.keys(taskProgress).length > 0 && (
          <div className="mt-2">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${(Object.values(taskProgress).filter(p => p.completed).length / recommendations.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
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