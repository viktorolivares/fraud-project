"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Cpu, FileText, Activity } from "lucide-react"
import { getSystemSummary } from "@/api/dashboard.api"
import type { SystemSummaryRow } from "@/types/dashboard"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardFilters } from "@/contexts/dashboard-filter-provider"

export function SectionCards() {
  const [summary, setSummary] = useState<SystemSummaryRow | null>(null)
  const [loading, setLoading] = useState(true)
  const { filters } = useDashboardFilters()

  useEffect(() => {
    setLoading(true)
    getSystemSummary(filters.from, filters.to, filters.channelId)
      .then((data) => setSummary(data[0]))
      .catch((error) => {
        console.error('Error fetching system summary:', error)
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [filters.from, filters.to, filters.channelId])

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="relative">
              <CardDescription>Cargando...</CardDescription>
              <CardTitle className="text-4xl font-semibold tabular-nums">
                --
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Error al cargar datos</CardDescription>
            <CardTitle className="text-xl text-red-500">
              Sin datos disponibles
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const cards = [
    {
      id: "cases",
      title: summary.cases_count.toString(),
      description: "Casos",
      icon: FileText
    },
    {
      id: "incidents",
      title: summary.incidents_count.toString(),
      description: "Incidentes",
      icon: AlertTriangle
    },
    {
      id: "bots",
      title: summary.bots_count.toString(),
      description: "Bots",
      icon: Cpu
    },
    {
      id: "executions",
      title: summary.executions_count.toString(),
      description: "Ejecuciones",
      icon: Activity
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ id, title, description, icon: Icon }) => (
        <Card key={id}>
          <CardHeader className="relative">
            <CardDescription>{description}</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {title}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 text-xs">
                <Icon className="size-3" />
              </Badge>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}