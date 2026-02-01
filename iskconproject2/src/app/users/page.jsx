'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import WelcomeCard from './components/dashboard/WelcomeCard'
import SummaryCards from './components/dashboard/SummaryCards'
import TodaySchedule from './components/dashboard/TodaySchedule'
import KrishnaQuote from './components/dashboard/KrishnaQuote'
import { getDashboardData } from '@/actions/user/userdashboardActions'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await getDashboardData()
      console.log("DASHBOARD DATA:", res)

      if (res.success) {
        setDashboardData(res.data)
      }

      setLoading(false)
    }

    loadDashboard()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">

        {/* Welcome Section */}
        <WelcomeCard userName="Devotee" />

        {/* Summary Cards */}
        <SummaryCards data={dashboardData} loading={loading} />

        {/* Daily Quote */}
        <KrishnaQuote />

        {/* Today's Schedule */}
        <TodaySchedule data={dashboardData?.todaySchedule} loading={loading} />

      </div>
    </DashboardLayout>
  )
}
