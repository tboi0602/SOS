
export default function Loading(){
  return (
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        <div className="relative size-12 flex items-center justify-center">
          <div className="absolute size-full rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute size-8 rounded-full border border-cyan/20 border-b-cyan animate-spin [animation-direction:reverse]" />
        </div>
      </div>
  )
}