"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Building2, TrendingUp, TrendingDown, ArrowRight, Home, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

type DashboardData = {
  totalBiens: number
  totalEntrees: number
  totalSorties: number
  solde: number
  monthlyData: { mois: string; entrees: number; sorties: number }[]
  categoriesSorties: { name: string; value: number; color: string }[]
  categoriesEntrees: { name: string; value: number; color: string }[]
  biens: { id: number; name: string; totalEntrees: number; totalSorties: number; solde: number }[]
}

const YEARS = ["2024", "2025", "2026"]

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState("2026")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/dashboard?year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setData(await res.json())
      setLoading(false)
    }
    load()
  }, [selectedYear])

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de votre trésorerie</p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32 bg-input border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {YEARS.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total biens</p>
                    <p className="text-2xl font-bold text-foreground">{data.totalBiens}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total entrées</p>
                    <p className="text-2xl font-bold text-chart-1">
                      +{data.totalEntrees.toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total sorties</p>
                    <p className="text-2xl font-bold text-chart-2">
                      -{data.totalSorties.toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.solde >= 0 ? "bg-chart-1/10" : "bg-chart-2/10"}`}>
                    {data.solde >= 0
                      ? <TrendingUp className="w-5 h-5 text-chart-1" />
                      : <TrendingDown className="w-5 h-5 text-chart-2" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde net</p>
                    <p className={`text-2xl font-bold ${data.solde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                      {data.solde >= 0 ? "+" : ""}{data.solde.toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Évolution mensuelle</CardTitle>
                <CardDescription className="text-muted-foreground">Entrées et sorties par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mois" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                        formatter={(value: number, name: string) => [`${value.toLocaleString("fr-FR")} €`, name === "entrees" ? "Entrées" : "Sorties"]}
                      />
                      <Bar dataKey="entrees" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Entrées" />
                      <Bar dataKey="sorties" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Sorties" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Répartition des sorties</CardTitle>
                <CardDescription className="text-muted-foreground">Distribution par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.categoriesSorties} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
                        {data.categoriesSorties.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Répartition des entrées</CardTitle>
              <CardDescription className="text-muted-foreground">Distribution par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.categoriesEntrees} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
                      {data.categoriesEntrees.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`]} />
                    <Legend formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Liste des biens */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Mes biens</CardTitle>
                <CardDescription className="text-muted-foreground">Accès rapide à vos biens</CardDescription>
              </div>
              <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
                <Link href="/biens">
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.biens.map((bien) => (
                  <Link key={bien.id} href={`/biens/${bien.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{bien.name}</p>
                      <p className={`text-xs ${bien.solde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                        Solde : {bien.solde >= 0 ? "+" : ""}{bien.solde.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
