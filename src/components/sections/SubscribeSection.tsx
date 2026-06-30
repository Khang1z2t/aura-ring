export function SubscribeSection() {
  return (
    <section
      id="subscribe"
      className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-ember to-amber p-6 text-white md:p-8 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">Subscribe</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Get launch drops, restock alerts, and product notes before everyone else.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
            Join the Aurora list for early access to new finishes, limited releases, and product
            updates shaped around recovery-first living.
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-3 md:max-w-2xl md:flex-row">
          <input
            type="email"
            placeholder="Email address"
            className="h-12 flex-1 rounded-full border border-white/20 bg-white/12 px-5 text-sm text-white placeholder:text-white/60 outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-[#211d1a] transition duration-150 hover:bg-white/90"
          >
            Join the list
          </button>
        </form>
      </div>
    </section>
  )
}
