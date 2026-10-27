import { ImageResponse } from 'next/og'

export const alt = 'Taher Fawaz — Senior Mobile Application Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Shared social card for every page. Text is Latin only, so no Arabic font file is needed here.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#1f4d3a', color: '#f6f1e7', padding: 72, fontFamily: 'serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30 }}>
          <div style={{ width: 34, height: 34, borderRadius: 34, border: '2px solid #f6f1e7', display: 'flex' }} />
          Taher Fawaz
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 950 }}>I build mobile apps at scale, then explain how they work.</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: 'rgba(246,241,231,.8)' }}>
          <span>Senior Mobile Application Developer · Flutter · Android</span>
          <span style={{ color: '#d4ac55' }}>●</span>
        </div>
      </div>
    ),
    size,
  )
}
