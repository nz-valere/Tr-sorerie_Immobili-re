import Link from "next/link"
import { Building2, ArrowRight, TrendingUp, Home, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">ValTreso</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-foreground">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/register">Commencer</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Gérez votre trésorerie en toute simplicité
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Suivez les entrées et sorties de vos biens, visualisez vos flux financiers
              et gardez le contrôle de votre patrimoine.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                <Link href="/register">
                  Créer un compte gratuit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-border text-foreground w-full sm:w-auto"
              >
                <Link href="/login">J&apos;ai déjà un compte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-muted-foreground">
              Des outils puissants pour gérer efficacement votre patrimoine
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Gestion des biens</h3>
              <p className="text-muted-foreground">
                Ajoutez et organisez tous vos biens en un seul endroit. Gardez une vue
                claire sur votre patrimoine.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Suivi de trésorerie</h3>
              <p className="text-muted-foreground">
                Enregistrez vos entrées et sorties mois par mois. Visualisez votre solde net en
                temps réel.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Graphiques et analyses</h3>
              <p className="text-muted-foreground">
                Visualisez l&apos;évolution de vos finances avec des graphiques clairs. Analysez vos
                dépenses par catégorie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-card border border-border p-8 lg:p-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Prêt à mieux gérer vos biens ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Rejoignez ValTreso et commencez à suivre votre trésorerie dès
              aujourd&apos;hui.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/register">
                Commencer gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">ValTreso</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ValTreso. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
