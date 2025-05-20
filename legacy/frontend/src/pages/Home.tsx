import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="text-center py-10">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome to NFTer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your photos into unique anime-style characters using AI. 
          Create your own NFT-style avatars with just a few clicks.
        </p>
        <Button asChild size="lg" className="px-8">
          <Link to="/generate">
            Create Your Avatar
          </Link>
        </Button>
      </div>
    </div>
  )
} 