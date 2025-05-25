import { useEffect, useState } from 'react'
import { auth } from '@/utils/firebase'

export default function TestFirebase() {
  const [status, setStatus] = useState<string>('Checking Firebase...')
  
  useEffect(() => {
    // Test Firebase connection
    if (auth) {
      setStatus('Firebase connected! App: ' + auth.app.name)
      console.log('Firebase config:', auth.app.options)
    } else {
      setStatus('Firebase not initialized')
    }
  }, [])
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Page</h1>
      <p>{status}</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(auth?.app?.options || {}, null, 2)}
      </pre>
    </div>
  )
}