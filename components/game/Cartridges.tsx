'use client'

import { useState } from 'react'
import { unlock } from '@/lib/achievements'

export type Job = { id: string; short: string; company: string; role: string; years: string; place: string; note: string; now: boolean; shell: string }

/** Experience as cartridges: choosing one lifts it and loads its details into the console panel. */
export function Cartridges({ jobs, labels }: { jobs: Job[]; labels: { now: string; list: string } }) {
  const [active, setActive] = useState(0)
  const job = jobs[active]
  if (!job) return null
  return (
    <div className="flex flex-wrap items-start gap-9">
      <ul className="flex min-w-0 flex-[999_1_32rem] flex-wrap items-end gap-4" aria-label={labels.list}>
        {jobs.map((j, i) => (
          <li key={j.id}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => {
                setActive(i)
                if (i > 0) unlock('cart')
              }}
              className="cart flex h-[10.5rem] w-[8.25rem] cursor-pointer flex-col rounded-[10px_10px_18px_18px] border-2 border-ink p-3 text-start shadow-[0_6px_0_var(--ink)]"
              style={{ background: j.shell, transform: active === i ? 'translateY(-18px)' : undefined }}
            >
              <span aria-hidden="true" className="mb-2.5 flex gap-1">
                {[0, 1, 2].map((k) => <span key={k} className="h-1.5 w-[18px] rounded-sm bg-ink/30" />)}
              </span>
              <span className="flex flex-1 flex-col rounded-lg border-2 border-ink bg-surface p-2">
                <span className="mono text-[0.6rem] text-muted" dir="ltr">{j.years}</span>
                <span className="mt-1 font-[family-name:var(--font-unbounded)] text-[0.8rem] font-bold leading-tight"><bdi dir="ltr">{j.short}</bdi></span>
                {j.now ? <span className="mono mt-auto text-[0.6rem] text-orange-ink">● {labels.now}</span> : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="min-w-0 flex-[1_1_21rem]">
        <div className="rounded-[28px] bg-ink p-6 text-paper shadow-[0_8px_0_var(--orange)]">
          <div aria-hidden="true" className="mb-5 h-3 rounded-md bg-[#2A2A2E]" />
          <div key={job.id} className="insert min-h-44" aria-live="polite">
            <p className="mono text-[0.75rem] text-yellow"><bdi dir="ltr">{job.years}</bdi> · {job.place}</p>
            <p className="mt-2 font-[family-name:var(--font-unbounded)] text-[1.6rem] font-bold leading-tight [html[lang=ar]_&]:font-[family-name:var(--font-alexandria)]"><bdi dir="ltr">{job.company}</bdi></p>
            <p className="mt-1 text-[#CFCBC2]">{job.role}</p>
            {job.note ? <p className="mt-3.5 text-[0.95rem] leading-relaxed">{job.note}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
