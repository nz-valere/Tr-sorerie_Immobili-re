"use client"

import { useState } from "react"
import { Home, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddBienDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddBienDialog({ open, onOpenChange, onSuccess }: AddBienDialogProps) {
  const [nom, setNom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setNom("")
    setAdresse("")
    setError("")
    setSuccess(false)
  }

  const handleClose = (value: boolean) => {
    if (!value) resetForm()
    onOpenChange(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!nom || !adresse) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/biens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nom, address: adresse }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        onSuccess?.()
      } else {
        setError(data.error || "Erreur lors de la création du bien")
      }
    } catch {
      setError("Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Bien créé avec succès !</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Votre bien a été ajouté à votre liste. Vous pouvez maintenant y ajouter des
              transactions.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-border text-foreground"
                onClick={() => handleClose(false)}
              >
                Fermer
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  resetForm()
                }}
              >
                Ajouter un autre bien
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">Ajouter un bien</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Renseignez les informations de votre nouveau bien immobilier
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nom" className="text-foreground">
                  Nom du bien
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Ex: Appartement Haussmannien"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Un nom unique pour identifier facilement ce bien
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-foreground">
                  Adresse complète
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="adresse"
                    type="text"
                    placeholder="Ex: 24 Avenue des Champs-Élysées, 75008 Paris"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border text-foreground"
                  onClick={() => handleClose(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!nom || !adresse || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer le bien"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}