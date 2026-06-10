
export default function Loading(){
  return (
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[size:4rem_4rem] opacity-40" style={{ backgroundImage: "linear-gradient(to right, var(--border-base) 1px, transparent 1px), linear-gradient(to bottom, var(--border-base) 1px, transparent 1px)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)", maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)" }} />
        <div className="relative size-12 flex items-center justify-center">
          <div className="absolute size-full rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute size-8 rounded-full border border-accent/20 border-b-accent animate-spin [animation-direction:reverse]" />
        </div>
      </div>
  )
}