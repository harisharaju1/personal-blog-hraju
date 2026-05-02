import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#171717',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 19,
          fontWeight: 400,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.5px',
          paddingBottom: 1,
        }}
      >
        h
      </div>
    ),
    { ...size },
  )
}
