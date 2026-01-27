'use client'

export default function WelcomeCard({ userName = 'Devotee' }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-peacock to-peacock/90 p-6 text-white shadow-lg">
      {/* Decorative lotus watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 5C50 5 60 25 50 45C40 25 50 5 50 5Z" />
          <path d="M50 5C50 5 70 15 60 45C80 25 50 5 50 5Z" />
          <path d="M50 5C50 5 30 15 40 45C20 25 50 5 50 5Z" />
          <path d="M50 45C50 45 70 55 50 75C30 55 50 45 50 45Z" />
          <path d="M50 75C50 75 55 85 50 95C45 85 50 75 50 75Z" />
        </svg>
      </div>
      
      {/* Flute silhouette */}
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2 opacity-5">
        <svg width="200" height="20" viewBox="0 0 200 20" fill="currentColor">
          <rect x="0" y="8" width="180" height="4" rx="2" />
          <circle cx="30" cy="10" r="3" />
          <circle cx="50" cy="10" r="3" />
          <circle cx="70" cy="10" r="3" />
          <circle cx="90" cy="10" r="3" />
          <circle cx="110" cy="10" r="3" />
          <ellipse cx="190" cy="10" rx="10" ry="8" />
        </svg>
      </div>

      <div className="relative z-10">
        <p className="text-saffron font-medium mb-1">Hare Krishna</p>
        <h2 className="text-2xl font-semibold mb-2">
          Welcome, {userName}
        </h2>
        <p className="text-white/80 text-sm">
          Welcome to Sanjeevani IT Cell User Portal
        </p>
      </div>
    </div>
  )
}
