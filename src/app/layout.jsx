import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#e2e9ef]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}