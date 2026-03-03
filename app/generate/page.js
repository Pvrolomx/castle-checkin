'use client'

import { useState } from 'react'
import Link from 'next/link'

const ADMIN_PIN = '1978'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A', pin: '2531' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B', pin: '2532' },
  { id: 'villa-magna-336', name: 'Villa Magna 336', pin: '3360' },
  { id: 'estrella-502', name: 'V Estrella 502', pin: '5020' },
  { id: 'casita-1', name: 'Casita 1', pin: '1001' },
  { id: 'casita-2', name: 'Casita 2', pin: '1002' },
  { id: 'nitta-102', name: 'Nitta 102', pin: '1020' },
  { id: 'mismaloya-7202', name: 'Mismaloya 7202', pin: '7202' },
  { id: 'mismaloya-5705', name: 'Mismaloya 5705', pin: '5705' },
  { id: 'avida-408', name: 'Avida 408', pin: '4080' },
  { id: 'cielo-101', name: 'Cielo 101', pin: '1010' },
]

export default function GeneratePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const handlePin = (e) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
      setPin('')
    }
  }

  const handleWhatsApp = (prop) => {
    const message = `\u{1F3F0} Castle Solutions\n\nWelcome! Here is your check-in info for *${prop.name}*:\n\n\u{1F517} Link: https://castlesolutions.mx\n\u{1F511} PIN: *${prop.pin}*\n\nClick the link, tap "Check-in", select your property, and enter your PIN.\n\nWe look forward to welcoming you to Puerto Vallarta! \u{1F334}\n\n---\n\n\u{1F3F0} Castle Solutions\n\n\u{00A1}Bienvenido! Aqu\u{00ED} est\u{00E1} tu informaci\u{00F3}n de check-in para *${prop.name}*:\n\n\u{1F517} Link: https://castlesolutions.mx\n\u{1F511} PIN: *${prop.pin}*\n\nHaz clic en el enlace, toca "Check-in", selecciona tu propiedad e ingresa tu PIN.\n\n\u{00A1}Te esperamos en Puerto Vallarta! \u{1F334}`

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCopyPin = async (prop) => {
    const text = `${prop.name} — PIN: ${prop.pin}\nhttps://castlesolutions.mx`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedId(prop.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F5F1E6' }}>
        <div className="text-center fade-in max-w-sm mx-auto">
          <div className="mb-8">
            <img src="/logo.png" alt="Castle Solutions" className="h-16 mx-auto mb-4" />
          </div>
          <form onSubmit={handlePin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false) }}
              placeholder="PIN"
              autoFocus
              className="w-32 mx-auto block text-center text-2xl tracking-[0.5em] bg-white border border-gray-300 rounded-xl py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />
            {pinError && (
              <p className="text-red-500 text-sm fade-in">PIN incorrecto</p>
            )}
            <button type="submit" className="mt-4 px-8 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors">
              Enter
            </button>
          </form>
          <div className="mt-8">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#F5F1E6' }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8 fade-in">
          <img src="/logo.png" alt="Castle Solutions" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Panel de Check-in
          </h1>
          <p className="text-gray-500 text-sm mt-1">PINs de acceso por propiedad</p>
        </div>

        <div className="space-y-3 fade-in" style={{ animationDelay: '0.1s' }}>
          {PROPERTIES.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-800">{p.name}</span>
                <span className="font-mono text-lg font-bold tracking-wider" style={{ color: '#C9A227' }}>{p.pin}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyPin(p)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: copiedId === p.id ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.03)',
                    color: copiedId === p.id ? '#16a34a' : '#6b7280',
                    border: `1px solid ${copiedId === p.id ? 'rgba(34,197,94,0.3)' : 'rgba(0,0,0,0.08)'}`
                  }}
                >
                  {copiedId === p.id ? '✅ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={() => handleWhatsApp(p)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#25D366' }}
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>
        <div className="text-center mt-4 text-gray-400 text-xs">
          <p>Castle Solutions © {new Date().getFullYear()}</p>
          <p className="mt-1">Hecho por <span style={{color: '#C9A227'}}>duendes.app</span> 2026</p>
        </div>
      </div>
    </div>
  )
}
