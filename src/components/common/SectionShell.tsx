import { cn } from '@/lib/utils'

interface SectionShellProps {
  id?: string
  title: string
  description: string
  className?: string
}

export function SectionShell({ id, title, description, className }: SectionShellProps) {
  return (
    <section id={id} className={cn('px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36', className)}>
      <div className="mx-auto max-w-7xl rounded-3xl border border-border bg-card/60 p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Scaffold</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}
