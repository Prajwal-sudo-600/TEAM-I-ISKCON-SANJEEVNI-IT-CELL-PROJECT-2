'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium">Back</span>
    </button>
  )
}
