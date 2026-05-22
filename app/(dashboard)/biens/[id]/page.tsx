"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Home,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mois = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

type TransactionType = "entrée" | "sortie"

type Transaction = {
  id: number
  property_id: number
  month: number
  year: number
  type: TransactionType
  amount: number
  label: string
  category: string
}

type Bien = {
  id: number
  name: string
  address: string
}

export default function BienDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [bien, setBien] = useState<Bien | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
  const years = ["2022", "2023", "2024", "2025", "2026"]

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [saving, setSaving] = useState(false)

  const [formType, setFormType] = useState<TransactionType>("entrée")
  const [formMois, setFormMois] = useState("1")
  const [formMontant, setFormMontant] = useState("")
  const [formLibelle, setFormLibelle] = useState("")
  const [formCategory, setFormCategory] = useState("")

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [bienRes, txRes] = await Promise.all([
        fetch(`/api/biens/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/biens/${id}/transactions?year=${selectedYear}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (!bienRes.ok) throw new Error("Bien introuvable")
      const [bienData, txData] = await Promise.all([bienRes.json(), txRes.json()])
      setBien(bienData)
      setTransactions(txData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id, selectedYear, token])

  useEffect(() => { fetchData() }, [fetchData])

  const getMonthData = (monthIndex: number) => {
    const monthTx = transactions.filter(t => t.month === monthIndex + 1)
    const entrees = monthTx.filter(t => t.type === "entrée").reduce((s, t) => s + t.amount, 0)
    const sorties = monthTx.filter(t => t.type === "sortie").reduce((s, t) => s + t.amount, 0)
    return { entrees, sorties, solde: entrees - sorties, transactions: monthTx }
  }

  const totalEntrees = transactions.filter(t => t.type === "entrée").reduce((s, t) => s + t.amount, 0)
  const totalSorties = transactions.filter(t => t.type === "sortie").reduce((s, t) => s + t.amount, 0)
  const totalSolde = totalEntrees - totalSorties

  const handleAdd = () => {
    setFormType("entrée")
    setFormMois("1")
    setFormMontant("")
    setFormLibelle("")
    setFormCategory("")
    setAddOpen(true)
  }

  const handleEdit = (tx: Transaction) => {
    setSelectedTx(tx)
    setFormMontant(String(tx.amount))
    setFormLibelle(tx.label)
    setFormCategory(tx.category)
    setEditOpen(true)
  }

  const handleDeleteClick = (tx: Transaction) => {
    setSelectedTx(tx)
    setDeleteOpen(true)
  }

  const submitAdd = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/biens/${id}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          month: Number(formMois),
          year: Number(selectedYear),
          type: formType,
          amount: Number(formMontant),
          label: formLibelle,
          category: formCategory || formLibelle,
        }),
      })
      if (!res.ok) throw new Error("Erreur lors de l'ajout")
      setAddOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const submitEdit = async () => {
    if (!selectedTx) return
    setSaving(true)
    try {
      const res = await fetch(`/api/biens/${id}/transactions/${selectedTx.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          amount: Number(formMontant),
          label: formLibelle,
          category: formCategory || formLibelle,
        }),
      })
      if (!res.ok) throw new Error("Erreur lors de la modification")
      setEditOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedTx) return
    setSaving(true)
    try {
      const res = await fetch(`/api/biens/${id}/transactions/${selectedTx.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      setDeleteOpen(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !bien) {
    return (
      <div className="p-4 lg:p-8">
        <p className="text-destructive">{error ?? "Bien introuvable"}</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/biens">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux biens
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{bien.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{bien.address}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="border-border text-foreground">
              <Link href={`/biens/${id}/modifier`}>
                <Pencil className="w-4 h-4 mr-2" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total entrées</p>
                <p className="text-xl font-bold text-chart-1">+{totalEntrees.toLocaleString("fr-FR")} €</p>
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
                <p className="text-xl font-bold text-chart-2">-{totalSorties.toLocaleString("fr-FR")} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${totalSolde >= 0 ? "bg-chart-1/10" : "bg-chart-2/10"}`}>
                {totalSolde >= 0
                  ? <TrendingUp className="w-5 h-5 text-chart-1" />
                  : <TrendingDown className="w-5 h-5 text-chart-2" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solde net</p>
                <p className={`text-xl font-bold ${totalSolde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                  {totalSolde >= 0 ? "+" : ""}{totalSolde.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de trésorerie */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tableau de trésorerie
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32 bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Mois</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Entrées</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Sorties</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Solde</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mois.map((nomMois, index) => {
                  const data = getMonthData(index)
                  return (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium text-foreground">{nomMois}</TableCell>
                      <TableCell className="text-right">
                        {data.entrees > 0
                          ? <span className="text-chart-1 font-medium">+{data.entrees.toLocaleString("fr-FR")} €</span>
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.sorties > 0
                          ? <span className="text-chart-2 font-medium">-{data.sorties.toLocaleString("fr-FR")} €</span>
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.entrees > 0 || data.sorties > 0
                          ? <span className={`font-semibold ${data.solde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                              {data.solde >= 0 ? "+" : ""}{data.solde.toLocaleString("fr-FR")} €
                            </span>
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {data.transactions.length > 0
                            ? data.transactions.map((t) => (
                                <div key={t.id} className="flex items-center gap-2 group">
                                  <span className={`text-xs ${t.type === "entrée" ? "text-chart-1" : "text-chart-2"}`}>
                                    {t.label}: {t.type === "entrée" ? "+" : "-"}{t.amount.toLocaleString("fr-FR")} €
                                  </span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(t)} className="text-muted-foreground hover:text-foreground">
                                      <Pencil className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(t)} className="text-muted-foreground hover:text-destructive">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            : <span className="text-xs text-muted-foreground">Aucune transaction</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="border-border bg-muted/30 font-bold">
                  <TableCell className="text-foreground">Total annuel</TableCell>
                  <TableCell className="text-right text-chart-1">+{totalEntrees.toLocaleString("fr-FR")} €</TableCell>
                  <TableCell className="text-right text-chart-2">-{totalSorties.toLocaleString("fr-FR")} €</TableCell>
                  <TableCell className={`text-right ${totalSolde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                    {totalSolde >= 0 ? "+" : ""}{totalSolde.toLocaleString("fr-FR")} €
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Ajouter une transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enregistrez une nouvelle entrée ou sortie d&apos;argent
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formType === "entrée" ? "default" : "outline"}
                onClick={() => setFormType("entrée")}
                className={formType === "entrée" ? "bg-chart-1 text-primary-foreground hover:bg-chart-1/90" : "border-border text-foreground"}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Entrée
              </Button>
              <Button
                type="button"
                variant={formType === "sortie" ? "default" : "outline"}
                onClick={() => setFormType("sortie")}
                className={formType === "sortie" ? "bg-chart-2 text-primary-foreground hover:bg-chart-2/90" : "border-border text-foreground"}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Sortie
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Mois</Label>
              <Select value={formMois} onValueChange={setFormMois}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mois.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Montant (€)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={formMontant}
                onChange={(e) => setFormMontant(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Libellé</Label>
              <Input
                type="text"
                placeholder="Ex: Loyer, Charges, Travaux..."
                value={formLibelle}
                onChange={(e) => setFormLibelle(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Catégorie</Label>
              <Input
                type="text"
                placeholder="Ex: Loyer, Charges, Travaux..."
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-border text-foreground">
              Annuler
            </Button>
            <Button
              onClick={submitAdd}
              disabled={!formMontant || !formLibelle || saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Modifier la transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Modifiez les informations de cette transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Montant (€)</Label>
              <Input
                type="number"
                value={formMontant}
                onChange={(e) => setFormMontant(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Libellé</Label>
              <Input
                type="text"
                value={formLibelle}
                onChange={(e) => setFormLibelle(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Catégorie</Label>
              <Input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-border text-foreground">
              Annuler
            </Button>
            <Button
              onClick={submitEdit}
              disabled={!formMontant || !formLibelle || saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Supprimer cette transaction ?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Cette action est irréversible. La transaction &quot;{selectedTx?.label}&quot; sera définitivement supprimée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-border text-foreground">
              Annuler
            </Button>
            <Button variant="destructive" onClick={submitDelete} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
