"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Home, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Données fictives pour le design
const mockBien = {
  id: "1",
  nom: "Appartement Haussmannien",
  adresse: "24 Avenue des Champs-Élysées, 75008 Paris",
}

export default function ModifierBienPage() {
  const [nom, setNom] = useState(mockBien.nom)
  const [adresse, setAdresse] = useState(mockBien.adresse)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pas de logique - juste le design
    if (nom && adresse) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-lg mx-auto">
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Bien modifié avec succès !
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                Les informations de votre bien ont été mises à jour.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild className="border-border text-foreground">
                  <Link href="/biens">Retour à la liste</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/biens/${mockBien.id}`}>Voir le bien</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/biens/${mockBien.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Modifier le bien</h1>
        <p className="text-muted-foreground mt-1">
          Modifiez les informations de votre bien immobilier
        </p>
      </div>

      <div className="max-w-lg">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Informations du bien</CardTitle>
            <CardDescription className="text-muted-foreground">
              Mettez à jour les informations de votre bien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-foreground">
                  Adresse complète
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
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

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1 border-border text-foreground"
                >
                  <Link href={`/biens/${mockBien.id}`}>Annuler</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!nom || !adresse}
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
