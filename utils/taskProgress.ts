import { db } from './firebase'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'

export interface TaskProgress {
  taskId: string
  userId: string
  started: boolean
  completed: boolean
  lastSaved: Date
  nextStep: string // Exactly what to do next
  deadlineDate: Date
  penaltyIfMissed: number // Real money they'll lose
  taskType: 'RED_FLAG' | 'FORM' | 'RECOMMENDATION'
  title: string
  startedAt?: Date
  completedAt?: Date
}

export interface TaskProgressUpdate {
  started?: boolean
  completed?: boolean
  nextStep?: string
  completedAt?: Date
}

// Save task progress
export async function saveTaskProgress(progress: TaskProgress): Promise<void> {
  try {
    const progressDoc = doc(db, 'taskProgress', `${progress.userId}_${progress.taskId}`)
    await setDoc(progressDoc, {
      ...progress,
      lastSaved: new Date(),
      startedAt: progress.started && !progress.startedAt ? new Date() : progress.startedAt
    }, { merge: true })
  } catch (error) {
    console.error('Error saving task progress:', error)
    throw error
  }
}

// Get task progress for a specific task
export async function getTaskProgress(userId: string, taskId: string): Promise<TaskProgress | null> {
  try {
    const progressDoc = doc(db, 'taskProgress', `${userId}_${taskId}`)
    const docSnap = await getDoc(progressDoc)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        lastSaved: data.lastSaved.toDate(),
        deadlineDate: data.deadlineDate.toDate(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as TaskProgress
    }
    return null
  } catch (error) {
    console.error('Error getting task progress:', error)
    return null
  }
}

// Get all task progress for a user
export async function getUserTaskProgress(userId: string): Promise<TaskProgress[]> {
  try {
    const q = query(collection(db, 'taskProgress'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        lastSaved: data.lastSaved.toDate(),
        deadlineDate: data.deadlineDate.toDate(),
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as TaskProgress
    })
  } catch (error) {
    console.error('Error getting user task progress:', error)
    return []
  }
}

// Update task progress
export async function updateTaskProgress(userId: string, taskId: string, updates: TaskProgressUpdate): Promise<void> {
  try {
    const progressDoc = doc(db, 'taskProgress', `${userId}_${taskId}`)
    const updateData: any = {
      ...updates,
      lastSaved: new Date()
    }
    
    if (updates.completed) {
      updateData.completedAt = new Date()
    }
    
    await updateDoc(progressDoc, updateData)
  } catch (error) {
    console.error('Error updating task progress:', error)
    throw error
  }
}

// Mark task as started
export async function markTaskAsStarted(userId: string, taskId: string, taskData: {
  title: string
  deadlineDate: Date
  penaltyIfMissed: number
  taskType: 'RED_FLAG' | 'FORM' | 'RECOMMENDATION'
  nextStep: string
}): Promise<void> {
  const progress: TaskProgress = {
    taskId,
    userId,
    started: true,
    completed: false,
    lastSaved: new Date(),
    startedAt: new Date(),
    ...taskData
  }
  
  await saveTaskProgress(progress)
}

// Mark task as completed
export async function markTaskAsCompleted(userId: string, taskId: string): Promise<void> {
  await updateTaskProgress(userId, taskId, {
    completed: true,
    completedAt: new Date()
  })
}

// Calculate days until deadline
export function calculateDaysUntilDeadline(deadlineDate: Date): number {
  const now = new Date()
  const deadline = new Date(deadlineDate)
  const diffTime = deadline.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Get deadline urgency level
export function getDeadlineUrgency(deadlineDate: Date): 'OVERDUE' | 'URGENT' | 'WARNING' | 'OK' {
  const daysLeft = calculateDaysUntilDeadline(deadlineDate)
  
  if (daysLeft < 0) return 'OVERDUE'
  if (daysLeft <= 3) return 'URGENT'
  if (daysLeft <= 7) return 'WARNING'
  return 'OK'
}

// Send deadline reminder (placeholder for email functionality)
export async function scheduleDeadlineReminder(userId: string, taskId: string, deadlineDate: Date): Promise<void> {
  // This would integrate with an email service
  // For now, we'll store reminder preferences in Firestore
  const reminderDoc = doc(db, 'deadlineReminders', `${userId}_${taskId}`)
  await setDoc(reminderDoc, {
    userId,
    taskId,
    deadlineDate,
    reminderSent: false,
    createdAt: new Date()
  })
} 