'use client'

import { Quote } from 'lucide-react'

export default function KrishnaQuote() {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-start gap-4">
        <div className="bg-saffron/20 p-3 rounded-lg shrink-0">
          <Quote className="w-5 h-5 text-saffron" />
        </div>
        <div>
          <p className="text-foreground italic text-lg leading-relaxed">
            &ldquo;Whatever you do, do it as an offering unto Me.&rdquo;
          </p>
          <p className="text-foreground font-medium mt-3">
            &mdash; Bhagavad Gita 9.27
          </p>
        </div>
      </div>
    </div>
  )
}
