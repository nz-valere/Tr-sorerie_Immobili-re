"use client"

import { useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Données fictives pour le design
const mockBien = {
  id: "1",
  nom: "Appartement Haussmannien",
  adresse: "24 Avenue des Champs-Élysées, 75008 Paris",
}

const mois = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

const mockTransactions = [
  { mois: 0, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 0, type: "sortie", montant: 150, libelle: "Charges copropriété" },
  { mois: 1, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 1, type: "sortie", montant: 150, libelle: "Charges copropriété" },
  { mois: 1, type: "sortie", montant: 320, libelle: "Réparation plomberie" },
  { mois: 2, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 2, type: "sortie", montant: 150, libelle: "Charges copropriété" },
  { mois: 3, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 3, type: "sortie", montant: 150, libelle: "Charges copropriété" },
  { mois: 3, type: "sortie", montant: 1200, libelle: "Taxe foncière" },
  { mois: 4, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 4, type: "sortie", montant: 150, libelle: "Charges copropriété" },
  { mois: 5, type: "entree", montant: 2000, libelle: "Loyer" },
  { mois: 5, type: "sortie", montant: 150, libelle: "Charges copropriété" },
]

type TransactionType = "entree" | "sortie"

export default function BienDetailPage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [addTransactionOpen, setAddTransactionOpen] = useState(false)
  const [editTransactionOpen, setEditTransactionOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>("entree")
  const [selectedMois, setSelectedMois] = useState("0")
  const [montant, setMontant] = useState("")
  const [libelle, setLibelle] = useState("")

  const years = ["2022", "2023", "2024", "2025", "2026"]

  // Calcul des totaux par mois
  const getMonthData = (monthIndex: number) => {
    const monthTransactions = mockTransactions.filter((t) => t.mois === monthIndex)
    const entrees = monthTransactions
      .filter((t) => t.type === "entree")
      .reduce((sum, t) => sum + t.montant, 0)
    const sorties = monthTransactions
      .filter((t) => t.type === "sortie")
      .reduce((sum, t) => sum + t.montant, 0)
    return { entrees, sorties, solde: entrees - sorties, transactions: monthTransactions }
  }

  // Totaux annuels
  const totalEntrees = mockTransactions
    .filter((t) => t.type === "entree")
    .reduce((sum, t) => sum + t.montant, 0)
  const totalSorties = mockTransactions
    .filter((t) => t.type === "sortie")
    .reduce((sum, t) => sum + t.montant, 0)
  const totalSolde = totalEntrees - totalSorties

  const handleAddTransaction = () => {
    setTransactionType("entree")
    setSelectedMois("0")
    setMontant("")
    setLibelle("")
    setAddTransactionOpen(true)
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
              <h1 className="text-2xl font-bold text-foreground">{mockBien.nom}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{mockBien.adresse}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="border-border text-foreground">
              <Link href={`/biens/${mockBien.id}/modifier`}>
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
                <p className="text-xl font-bold text-chart-1">
                  +{totalEntrees.toLocaleString("fr-FR")} €
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
                <p className="text-xl font-bold text-chart-2">
                  -{totalSorties.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  totalSolde >= 0 ? "bg-chart-1/10" : "bg-chart-2/10"
                }`}
              >
                {totalSolde >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-chart-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-chart-2" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solde net</p>
                <p
                  className={`text-xl font-bold ${totalSolde >= 0 ? "text-chart-1" : "text-chart-2"}`}
                >
                  {totalSolde >= 0 ? "+" : ""}
                  {totalSolde.toLocaleString("fr-FR")} €
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
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddTransaction}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
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
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Entrées
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Sorties
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">
                    Solde
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium">Détails</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mois.map((nomMois, index) => {
                  const data = getMonthData(index)
                  return (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium text-foreground">{nomMois}</TableCell>
                      <TableCell className="text-right">
                        {data.entrees > 0 ? (
                          <span className="text-chart-1 font-medium">
                            +{data.entrees.toLocaleString("fr-FR")} €
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.sorties > 0 ? (
                          <span className="text-chart-2 font-medium">
                            -{data.sorties.toLocaleString("fr-FR")} €
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {data.entrees > 0 || data.sorties > 0 ? (
                          <span
                            className={`font-semibold ${
                              data.solde >= 0 ? "text-chart-1" : "text-chart-2"
                            }`}
                          >
                            {data.solde >= 0 ? "+" : ""}
                            {data.solde.toLocaleString("fr-FR")} €
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {data.transactions.length > 0 ? (
                            data.transactions.map((t, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  t.type === "entree" ? "text-chart-1" : "text-chart-2"
                                }`}
                              >
                                {t.libelle}: {t.type === "entree" ? "+" : "-"}
                                {t.montant.toLocaleString("fr-FR")} €
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Aucune transaction
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {data.transactions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              <DropdownMenuItem
                                onClick={() => setEditTransactionOpen(true)}
                                className="cursor-pointer"
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialogOpen(true)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {/* Total Row */}
                <TableRow className="border-border bg-muted/30 font-bold">
                  <TableCell className="text-foreground">Total annuel</TableCell>
                  <TableCell className="text-right text-chart-1">
                    +{totalEntrees.toLocaleString("fr-FR")} €
                  </TableCell>
                  <TableCell className="text-right text-chart-2">
                    -{totalSorties.toLocaleString("fr-FR")} €
                  </TableCell>
                  <TableCell
                    className={`text-right ${totalSolde >= 0 ? "text-chart-1" : "text-chart-2"}`}
                  >
                    {totalSolde >= 0 ? "+" : ""}
                    {totalSolde.toLocaleString("fr-FR")} €
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
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
                variant={transactionType === "entree" ? "default" : "outline"}
                onClick={() => setTransactionType("entree")}
                className={
                  transactionType === "entree"
                    ? "bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                    : "border-border text-foreground"
                }
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Entrée
              </Button>
              <Button
                type="button"
                variant={transactionType === "sortie" ? "default" : "outline"}
                onClick={() => setTransactionType("sortie")}
                className={
                  transactionType === "sortie"
                    ? "bg-chart-2 text-primary-foreground hover:bg-chart-2/90"
                    : "border-border text-foreground"
                }
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Sortie
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Mois</Label>
              <Select value={selectedMois} onValueChange={setSelectedMois}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mois.map((m, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Montant (€)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Libellé</Label>
              <Input
                type="text"
                placeholder="Ex: Loyer, Charges, Travaux..."
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAddTransactionOpen(false)}
              className="border-border text-foreground"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setAddTransactionOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={editTransactionOpen} onOpenChange={setEditTransactionOpen}>
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
                placeholder="0.00"
                defaultValue="2000"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Libellé</Label>
              <Input
                type="text"
                placeholder="Ex: Loyer, Charges, Travaux..."
                defaultValue="Loyer"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditTransactionOpen(false)}
              className="border-border text-foreground"
            >
              Annuler
            </Button>
            <Button
              onClick={() => setEditTransactionOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Supprimer cette transaction ?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Cette action est irréversible. La transaction sera définitivement supprimée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-border text-foreground"
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(false)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
