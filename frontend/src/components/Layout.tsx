import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Toaster } from "sonner"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="hover:no-underline">
            <h1 className="text-2xl font-bold text-blue-600">NFTer</h1>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  )
} 