import React, { useEffect, useState } from 'react'
import { AlertTriangle, Calendar, DollarSign } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { getUserTaskProgress } from '@/utils/taskProgress'

interface UrgentDeadline {
  title: string
  daysLeft: number
  penalty: number
  formNumber?: string
  taskId: string
}

export default function DeadlineBanner() {
  const { user } = useAuth()
  const [urgentDeadlines, setUrgentDeadlines] = useState<UrgentDeadline[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!user) return

    const loadUrgentTasks = async () => {
      try {
        const taskProgress = await getUserTaskProgress(user.uid)
        
        // Find tasks that are urgent (within 7 days) and not completed
        const urgent = taskProgress
          .filter(task => !task.completed && task.deadlineDate)
          .map(task => {
            const daysLeft = Math.ceil((new Date(task.deadlineDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            return {
              title: task.title,
              daysLeft,
              penalty: task.penaltyIfMissed,
              taskId: task.taskId
            }
          })
          .filter(task => task.daysLeft <= 7)
          .sort((a, b) => a.daysLeft - b.daysLeft)
        
        setUrgentDeadlines(urgent)
      } catch (error) {
        console.error('Error loading urgent deadlines:', error)
      }
    }

    loadUrgentTasks()
    // Refresh every minute
    const interval = setInterval(loadUrgentTasks, 60000)
    
    return () => clearInterval(interval)
  }, [user])

  // Rotate through deadlines every 5 seconds
  useEffect(() => {
    if (urgentDeadlines.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentDeadlines.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [urgentDeadlines.length])

  if (!urgentDeadlines.length) return null

  const currentDeadline = urgentDeadlines[currentIndex]
  const isOverdue = currentDeadline.daysLeft < 0
  const isCritical = currentDeadline.daysLeft <= 3

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      isOverdue ? 'bg-red-600' : isCritical ? 'bg-orange-600' : 'bg-yellow-600'
    } text-white shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-bold text-lg">
                {isOverdue ? (
                  <>⚠️ OVERDUE: {currentDeadline.title}</>
                ) : (
                  <>{currentDeadline.formNumber || currentDeadline.title} due in {currentDeadline.daysLeft} DAYS</>
                )}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 ml-4">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">
                {isOverdue ? 'Accruing penalties: ' : 'Penalty if missed: '}
                ${currentDeadline.penalty.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="bg-white text-gray-900 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              onClick={() => {
                // Scroll to the task in the main view
                const element = document.getElementById(`task-${currentDeadline.taskId}`)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  element.classList.add('ring-4', 'ring-yellow-400')
                  setTimeout(() => {
                    element.classList.remove('ring-4', 'ring-yellow-400')
                  }, 3000)
                }
              }}
            >
              {isOverdue ? 'FIX NOW' : 'FILE NOW'}
            </button>
            
            <a 
              href="https://www.ato.gov.au/about-ato/contact-us" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
            >
              ATO RESOURCES
            </a>
          </div>
        </div>

        {/* Progress dots for multiple deadlines */}
        {urgentDeadlines.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {urgentDeadlines.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}