import { Construction } from "lucide-react"

export default function BienDetailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Construction className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Page en construction</h1>
      <p className="text-muted-foreground">Cette section n&apos;est pas encore implémentée.</p>
    </div>
  )
}
