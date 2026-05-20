"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search, MapPin, MoreVertical, Pencil, Trash2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Données fictives pour le design
const mockBiens = [
  {
    id: "1",
    nom: "Appartement Haussmannien",
    adresse: "24 Avenue des Champs-Élysées, 75008 Paris",
    totalEntrees: 24000,
    totalSorties: 8500,
  },
  {
    id: "2",
    nom: "Studio Marais",
    adresse: "15 Rue de Bretagne, 75003 Paris",
    totalEntrees: 9600,
    totalSorties: 3200,
  },
  {
    id: "3",
    nom: "Maison Bordeaux",
    adresse: "42 Rue Sainte-Catherine, 33000 Bordeaux",
    totalEntrees: 18000,
    totalSorties: 6800,
  },
  {
    id: "4",
    nom: "T3 Lyon",
    adresse: "8 Place Bellecour, 69002 Lyon",
    totalEntrees: 14400,
    totalSorties: 5100,
  },
]

export default function BiensPage() {
  const [search, setSearch] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBien, setSelectedBien] = useState<string | null>(null)

  const filteredBiens = mockBiens.filter(
    (bien) =>
      bien.nom.toLowerCase().includes(search.toLowerCase()) ||
      bien.adresse.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteClick = (id: string) => {
    setSelectedBien(id)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes biens</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos biens immobiliers et leur trésorerie
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/biens/nouveau">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un bien
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher un bien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Biens Grid */}
      {filteredBiens.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun bien trouvé</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-4">
              {search
                ? "Aucun bien ne correspond à votre recherche."
                : "Vous n'avez pas encore ajouté de bien. Commencez par en créer un."}
            </p>
            {!search && (
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/biens/nouveau">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter mon premier bien
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBiens.map((bien) => (
            <Card
              key={bien.id}
              className="border-border bg-card hover:border-primary/50 transition-colors group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/biens/${bien.id}/modifier`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(bien.id)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/biens/${bien.id}`} className="block">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {bien.nom}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{bien.adresse}</span>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Entrées</p>
                      <p className="text-sm font-semibold text-chart-1">
                        +{bien.totalEntrees.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sorties</p>
                      <p className="text-sm font-semibold text-chart-2">
                        -{bien.totalSorties.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-xs text-muted-foreground">Solde</p>
                      <p
                        className={`text-sm font-semibold ${
                          bien.totalEntrees - bien.totalSorties >= 0
                            ? "text-chart-1"
                            : "text-chart-2"
                        }`}
                      >
                        {(bien.totalEntrees - bien.totalSorties).toLocaleString("fr-FR")} €
                      </p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Supprimer ce bien ?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Cette action est irréversible. Toutes les transactions associées à ce bien seront
              également supprimées.
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
            <Button
              variant="destructive"
              onClick={() => {
                // Pas de logique - juste le design
                setDeleteDialogOpen(false)
                setSelectedBien(null)
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
