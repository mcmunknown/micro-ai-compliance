import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/components/AuthProvider'
import DeadlineBanner from '@/components/DeadlineBanner'
import PanicButton from '@/components/PanicButton'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DeadlineBanner />
      <Component {...pageProps} />
      <PanicButton />
    </AuthProvider>
  )
}