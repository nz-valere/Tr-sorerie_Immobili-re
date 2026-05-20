"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, MapPin, MoreVertical, Pencil, Trash2, Home, Loader2 } from "lucide-react"
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
import AddBienDialog from "@/components/ui/add-bien-dialog"

type Bien = {
  id: number
  name: string
  address: string
  totalEntrees: number
  totalSorties: number
  solde: number
}

export default function BiensPage() {
  const [biens, setBiens] = useState<Bien[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBien, setSelectedBien] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/biens", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setBiens(await res.json())
      setLoading(false)
    }
    load()
  }, [refreshKey])

  const filteredBiens = biens.filter(
    (bien) =>
      bien.name.toLowerCase().includes(search.toLowerCase()) ||
      bien.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteClick = (id: number) => {
    setSelectedBien(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBien) return
    setDeleting(true)
    const token = localStorage.getItem("token")
    await fetch(`/api/biens/${selectedBien}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeleting(false)
    setDeleteDialogOpen(false)
    setSelectedBien(null)
    setRefreshKey(k => k + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes biens</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos biens et leur trésorerie
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un bien
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
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter mon premier bien
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
                    {bien.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{bien.address}</span>
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
                      <p className={`text-sm font-semibold ${bien.solde >= 0 ? "text-chart-1" : "text-chart-2"}`}>
                        {bien.solde.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Bien Dialog */}
      <AddBienDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => setRefreshKey(k => k + 1)}
      />

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
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}