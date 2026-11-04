import { FRAMES, SPRITE_H, SPRITE_W, toRuns, type Pose } from '@/lib/taher-sprite'

const POSES: Pose[] = ['idle', 'blink', 'walkA', 'walkB', 'cheer']
// Computed once per module: a frame is ~60 rects after run-length merging.
const RUNS = Object.fromEntries(POSES.map((p) => [p, toRuns(FRAMES[p])])) as Record<Pose, ReturnType<typeof toRuns>>

/**
 * Pixel-art Taher. Every frame is drawn once; CSS shows the right one for the mode
 * (idle with an occasional blink, a two-frame walk, or a cheer). No JavaScript animation.
 */
export function TaherSprite({ mode = 'idle', className = '', title }: { mode?: 'idle' | 'walk' | 'cheer'; className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      shapeRendering="crispEdges"
      className={`sprite sprite-${mode} ${className}`}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      {POSES.map((p) => (
        <g key={p} className={`f-${p}`}>
          {RUNS[p].map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />)}
        </g>
      ))}
    </svg>
  )
}
