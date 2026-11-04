import { TaherSprite } from './TaherSprite'

export type LoadoutSkill = {
  id: string
  name: string
  monogram: string
  tier: string
  line: string
  /** 3 = main, 2 = second, 1 = side skill: the order Taher ranks them, not a measured score. */
  level: 1 | 2 | 3
  color: string
  chips: string[]
}

/** Skills as a game loadout: the main weapon is the big card, the others sit beside it. */
export function Loadout({ skills, equipped }: { skills: LoadoutSkill[]; equipped: string }) {
  return (
    <ul className="grid gap-6 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)]">
      {skills.map((s, i) => (
        <li
          key={s.id}
          className={`hw loadout-in relative flex flex-col overflow-hidden rounded-[28px] p-6 transition-transform duration-200 hover:-translate-y-1 ${s.level === 3 ? 'md:row-span-1' : ''}`}
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-2.5" style={{ background: s.color }} />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="chip" style={{ background: s.level === 3 ? '#FFC93C' : undefined }}>{s.tier}</span>
            <span className="flex gap-1" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className="h-3 w-7 overflow-hidden rounded-sm border-2 border-ink bg-surface">
                  {n <= s.level ? <span className="seg-fill block h-full w-full" style={{ background: s.color, animationDelay: `${300 + n * 140}ms` }} /> : null}
                </span>
              ))}
            </span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-ink font-[family-name:var(--font-unbounded)] text-lg font-bold shadow-[0_3px_0_var(--ink)]" style={{ background: s.color }}>
              {s.monogram}
            </span>
            <h3 className="font-[family-name:var(--font-unbounded)] text-[1.6rem] font-bold leading-tight tracking-[-0.02em]"><bdi dir="ltr">{s.name}</bdi></h3>
          </div>
          <p className="mt-4 max-w-[40ch] text-[#4A4945]">{s.line}</p>
          <ul className="mt-5 flex flex-wrap gap-2" dir="ltr">
            {s.chips.map((c) => <li key={c} className="tag">{c}</li>)}
          </ul>
          {s.level === 3 ? (
            <div className="mt-auto flex items-end justify-end gap-2 pt-6">
              <span className="mono mb-2 text-[0.7rem] text-muted">{equipped}</span>
              <TaherSprite className="h-20 w-[3.35rem]" />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
