import { ImageResponse } from 'next/og'
import { FRAMES, SPRITE_H, SPRITE_W, toRuns } from '@/lib/taher-sprite'

export const alt = 'Taher Fawaz — Senior Mobile Application Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Shared social card in the site's "handheld" style, with pixel Taher. Text is Latin only, so no font files are needed.
export default function OpengraphImage() {
  const runs = toRuns(FRAMES.cheer)
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EDEBE6', color: '#17171A', padding: 72, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 700 }}>
            <div style={{ width: 56, height: 56, borderRadius: 56, background: '#FF5B1F', border: '3px solid #17171A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>TF</div>
            Taher Fawaz
          </div>
          <div style={{ marginTop: 40, fontSize: 70, lineHeight: 1.05, fontWeight: 800, letterSpacing: -2 }}>I build mobile apps at scale, and teach how they work.</div>
          <div style={{ marginTop: 36, fontSize: 28, color: '#5F5E59' }}>Senior Mobile Application Developer · Flutter · Android</div>
        </div>
        <div style={{ display: 'flex', width: 300, height: 420, background: '#F6F4EF', border: '4px solid #17171A', borderRadius: 40, boxShadow: '0 12px 0 #17171A', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={SPRITE_W * 12} height={SPRITE_H * 12} viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`} shapeRendering="crispEdges">
            {runs.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />)}
          </svg>
        </div>
      </div>
    ),
    size,
  )
}
