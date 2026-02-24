import Link from 'next/link'
import { Activity, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Activity className="h-6 w-6 text-primary" />
          <span>PulseMonitor</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center space-y-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-background to-background">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight">
            Monitor your <span className="text-primary">stack</span> <br />
            with <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">confidence</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Real-time uptime monitoring, detailed analytics, and instant alerts.
            All in a premium, self-hosted dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg">Start Monitoring Free</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">View Demo</Button>
            </Link>
          </div>
        </section>

        <section className="py-20 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={Zap}
            title="Real-time Checks"
            description="We check your services every minute from multiple locations."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Instant Alerts"
            description="Get notified immediately when your service goes down."
          />
          <FeatureCard
            icon={Activity}
            title="Detailed Analytics"
            description="View response time history and uptime percentages."
          />
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} PulseMonitor. Open Source.
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
