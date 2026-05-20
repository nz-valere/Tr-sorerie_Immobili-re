import Link from "next/link"
import { Building2, Construction } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">ValTreso</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Page non disponible</h1>
        <p className="text-muted-foreground mb-8">
          Cette page n&apos;existe pas ou n&apos;est pas encore implémentée.
        </p>

        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/biens">Retour au dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
