import React from 'react'

interface AuditRiskGaugeProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
}

export default function AuditRiskGauge({ score, size = 'md' }: AuditRiskGaugeProps) {
  const getColor = (score: number) => {
    if (score < 25) return '#10B981' // green
    if (score < 50) return '#F59E0B' // yellow  
    if (score < 75) return '#F97316' // orange
    return '#EF4444' // red
  }

  const getRiskLabel = (score: number) => {
    if (score < 25) return 'LOW'
    if (score < 50) return 'MEDIUM'
    if (score < 75) return 'HIGH'
    return 'CRITICAL'
  }

  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-sm' },
    lg: { container: 'w-40 h-40', text: 'text-3xl', label: 'text-base' }
  }

  const currentSize = sizes[size]
  const color = getColor(score)
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={`relative ${currentSize.container} mx-auto`}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={`font-bold ${currentSize.text}`} 
          style={{ color }}
        >
          {score}
        </span>
        <span className={`font-medium text-gray-600 ${currentSize.label} mt-1`}>
          {getRiskLabel(score)}
        </span>
      </div>
      
      {/* Animated ring effect for high risk */}
      {score >= 75 && (
        <div 
          className="absolute inset-0 rounded-full border-2 animate-pulse"
          style={{ borderColor: color }}
        />
      )}
    </div>
  )
} 