'use client'

import { useState } from 'react'
import Link from 'next/link'

const ADMIN_PIN = '2026'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A', zone: 'Marina Vallarta' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B', zone: 'Marina Vallarta' },
  { id: 'villa-magna-336', name: 'Villa Magna 336', zone: 'Nuevo Nayarit' },
  { id: 'estrella-502', name: 'V Estrella 502', zone: 'Alta Vista' },
  { id: 'casita-1', name: 'Casita 1', zone: 'Centro/Malecón' },
  { id: 'casita-2', name: 'Casita 2', zone: 'Centro/Malecón' },
  { id: 'nitta-102', name: 'Nitta 102', zone: 'Zona Romántica' },
  { id: 'mismaloya-7202', name: 'Mismaloya 7202', zone: 'Mismaloya' },
  { id: 'mismaloya-5705', name: 'Mismaloya 5705', zone: 'Mismaloya' },
  { id: 'avida-408', name: 'Avida 408', zone: 'Fluvial Vallarta' },
  { id: 'cielo-101', name: 'Cielo 101', zone: 'Alta Vista' },
]

function encodeToken({ propertyId, email, guestName, arrival, departure }) {
  const data = { p: propertyId }
  if (email) data.e = email
  if (guestName) data.n = guestName
  if (arrival) data.a = arrival
  if (departure) data.d = departure
  return btoa(JSON.stringify(data))
}

export default function GeneratePage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState('')
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')

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

  const handleGenerate = (e) => {
    e.preventDefault()
    if (!selectedProperty) return

    const token = encodeToken({
      propertyId: selectedProperty,
      email,
      guestName,
      arrival,
      departure,
    })
    const link = `https://castlesolutions.mx/checkin?t=${token}`
    setGeneratedLink(link)
    setCopied(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = generatedLink
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareWhatsApp = () => {
    const prop = PROPERTIES.find(p => p.id === selectedProperty)
    const propName = prop ? prop.name : ''
    const name = guestName ? ` ${guestName}` : ''
    const dates = arrival && departure ? `\n📅 ${arrival} → ${departure}` : ''
    
    const message = `🏰 Castle Solutions Check-in\n\nHola${name}! Aquí está tu enlace de check-in para ${propName}:${dates}\n\n👉 ${generatedLink}\n\nPor favor completa el formulario antes de tu llegada. ¡Te esperamos en Puerto Vallarta! 🌴`
    
    const encodedMsg = encodeURIComponent(message)
    const cleanNumber = whatsappNumber.replace(/\D/g, '')
    
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMsg}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encodedMsg}`, '_blank')
    }
  }

  const handleReset = () => {
    setSelectedProperty('')
    setGuestName('')
    setEmail('')
    setArrival('')
    setDeparture('')
    setGeneratedLink('')
    setCopied(false)
    setWhatsappNumber('')
  }

  // PIN screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="text-center fade-in max-w-sm mx-auto">
          <div className="mb-8">
            <img src="/logo.png" alt="Castle Solutions" className="h-16 mx-auto mb-4 opacity-80" />
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
              className="w-32 mx-auto block text-center text-2xl tracking-[0.5em] bg-white/10 border border-white/20 rounded-xl py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
            />
            {pinError && (
              <p className="text-red-400 text-sm fade-in">PIN incorrecto</p>
            )}
            <button
              type="submit"
              className="text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              →
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Admin panel
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-lg mx-auto">
        
        <div className="text-center mb-8 fade-in">
          <img src="/logo.png" alt="Castle Solutions" className="h-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Generar Link de Check-in
          </h1>
          <p className="text-white/50 text-sm mt-1">Crea enlaces personalizados para huéspedes</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Property selector */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Propiedad *</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-400/50 appearance-none"
              >
                <option value="" className="bg-gray-800">Seleccionar propiedad...</option>
                {PROPERTIES.map(p => (
                  <option key={p.id} value={p.id} className="bg-gray-800">
                    {p.name} — {p.zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Guest name */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Nombre del huésped</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Smith"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Email del huésped</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@email.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Llegada</label>
                <input
                  type="date"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Salida</label>
                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            {/* WhatsApp number for direct share */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">WhatsApp del huésped (opcional)</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
              <p className="text-white/30 text-xs mt-1">Si lo incluyes, el botón de WhatsApp abre chat directo con el huésped</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C9A227, #E8D5A8)', color: '#1a1a2e' }}
            >
              🔗 Generar Link
            </button>
          </form>
        </div>

        {/* Generated link result */}
        {generatedLink && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/30 fade-in">
            <p className="text-white/70 text-sm mb-2">Link generado:</p>
            
            <div className="bg-black/30 rounded-xl p-3 mb-4 break-all">
              <p className="text-amber-300 text-sm font-mono">{generatedLink}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', 
                  color: copied ? '#22c55e' : 'white',
                  border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.2)'}`
                }}
              >
                {copied ? '✅ Copiado!' : '📋 Copiar'}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#25D366' }}
              >
                💬 Enviar WhatsApp
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-3 py-2 text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              Generar otro link →
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors text-sm">
            ← Volver al inicio
          </Link>
        </div>

        <div className="text-center mt-4 text-white/20 text-xs">
          <p>Castle Solutions © {new Date().getFullYear()}</p>
          <p className="mt-1">Hecho por <span style={{color: 'rgba(201,162,39,0.5)'}}>duendes.app</span> 2026</p>
        </div>
      </div>
    </div>
  )
}
