import { TopBar } from "@/components/rdm/top-bar"
import { Nav } from "@/components/rdm/nav"
import { Hero } from "@/components/rdm/hero"
import { LiveStatus } from "@/components/rdm/live-status"
import { Architect } from "@/components/rdm/architect"
import { Geopolitics } from "@/components/rdm/geopolitics"
import { Federations } from "@/components/rdm/federations"
import { Kernel } from "@/components/rdm/kernel"
import { Territory } from "@/components/rdm/territory"
import { CITEMESH } from "@/components/rdm/citemesh"
import { Isabella } from "@/components/rdm/isabella"
import { Tomos } from "@/components/rdm/tomos"
import { Evidence } from "@/components/rdm/evidence"
import { Layers } from "@/components/rdm/layers"
import { ClosingCTA } from "@/components/rdm/closing-cta"
import { Footer } from "@/components/rdm/footer"

export default async function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBar />
      <Nav />
      <Hero />
      <LiveStatus />
      <Architect />
      <Geopolitics />
      <Federations />
      <Kernel />
      <Territory />
      <CITEMESH />
      <Isabella />
      <Layers />
      <Evidence />
      <Tomos />
      <ClosingCTA />
      <Footer />
    </main>
  )
}
