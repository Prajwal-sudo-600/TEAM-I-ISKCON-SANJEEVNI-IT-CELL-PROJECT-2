'use client'

import DashboardLayout from './components/layout/DashboardLayout'
import WelcomeCard from './components/dashboard/WelcomeCard'
import SummaryCards from './components/dashboard/SummaryCards'
import TodaySchedule from './components/dashboard/TodaySchedule'
import KrishnaQuote from './components/dashboard/KrishnaQuote'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <WelcomeCard userName="Prabhu" />

        {/* Summary Cards */}
        <SummaryCards />

        {/* Daily Quote */}
        <KrishnaQuote />

        {/* Today's Schedule */}
        <TodaySchedule />
      </div>
    </DashboardLayout>
  )
}
