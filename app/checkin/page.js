'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B' },
  { id: 'villa-magna-336', name: 'Villa Magna 336' },
  { id: 'estrella-502', name: 'V Estrella 502' },
  { id: 'casita-1', name: 'Casita 1' },
  { id: 'casita-2', name: 'Casita 2' },
  { id: 'nitta-102', name: 'Nitta 102' },
  { id: 'mismaloya-7202', name: 'Mismaloya 7202' },
  { id: 'mismaloya-5705', name: 'Mismaloya 5705' },
  { id: 'avida-408', name: 'Avida 408' },
  { id: 'cielo-101', name: 'Cielo 101' },
]

const ARRIVAL_METHODS = {
  en: ['Airplane', 'Car', 'Bus', 'Other'],
  es: ['Avión', 'Auto', 'Autobús', 'Otro']
}

const FLIGHT_API = 'https://castle-flights.vercel.app/api/flight'

const TEXTS = {
  en: {
    back: '← Back to Home',
    title: 'Guest Check-in',
    subtitle: 'Welcome! Please complete this form before your arrival',
    property: 'Select Property',
    propertyLabel: 'Property',
    guestName: 'Guest Name',
    numGuests: 'Number of Guests',
    guestNames: 'Names of All Guests',
    guestNamesPlaceholder: 'Please list all guest names',
    phone: 'Cell Phone',
    email: 'Email',
    arrivalDate: 'Arrival Date',
    arrivalTime: 'Arrival Time',
    departureDate: 'Departure Date',
    departureTime: 'Departure Time',
    arrivalMethod: 'Arrival Method',
    flightNumber: 'Flight Number',
    flightPlaceholder: 'e.g. AA1234',
    specialRequests: 'Special Requests',
    specialPlaceholder: 'Any special requests or notes...',
    submit: 'Submit Check-in',
    submitting: 'Submitting...',
    successTitle: 'Welcome to Puerto Vallarta!',
    successSub: 'Your check-in is confirmed. We\'re thrilled to have you!',
    successProperty: 'Your stay at',
    successGuide: 'View Your Property Guide',
    successGuideDesc: 'WiFi, TV, safe, access codes & more — everything you need for your stay',
    successContact: 'We\'ll contact you shortly with arrival details.',
    error: 'There was an error. Please try again.',
    required: 'Required fields',
    flightFound: 'Flight found!',
    flightNotFound: 'Flight not found. You can still enter details manually.',
    flightSearching: 'Looking up flight...',
    flightRoute: 'Route',
    flightStatus: 'Status',
    flightETA: 'Estimated arrival',
    flightStatuses: { scheduled: 'Scheduled', active: 'In Flight', landed: 'Landed', cancelled: 'Cancelled', delayed: 'Delayed', diverted: 'Diverted' },
    trackFlight: 'Track this flight live',
    noToken: 'You need a check-in link to access this page.',
    noTokenSub: 'Please contact Castle Solutions to receive your personalized check-in link.',
    contactWhatsApp: 'Contact us on WhatsApp',
    invalidToken: 'This check-in link is invalid or expired.',
  },
  es: {
    back: '← Volver al Inicio',
    title: 'Registro de Huésped',
    subtitle: '¡Bienvenido! Por favor complete este formulario antes de su llegada',
    property: 'Seleccionar Propiedad',
    propertyLabel: 'Propiedad',
    guestName: 'Nombre del Huésped',
    numGuests: 'Número de Huéspedes',
    guestNames: 'Nombres de Todos los Huéspedes',
    guestNamesPlaceholder: 'Por favor liste todos los nombres',
    phone: 'Teléfono Celular',
    email: 'Correo Electrónico',
    arrivalDate: 'Fecha de Llegada',
    arrivalTime: 'Hora de Llegada',
    departureDate: 'Fecha de Salida',
    departureTime: 'Hora de Salida',
    arrivalMethod: 'Método de Llegada',
    flightNumber: 'Número de Vuelo',
    flightPlaceholder: 'ej. AA1234',
    specialRequests: 'Peticiones Especiales',
    specialPlaceholder: 'Alguna petición especial o nota...',
    submit: 'Enviar Registro',
    submitting: 'Enviando...',
    successTitle: '¡Bienvenido(a) a Puerto Vallarta!',
    successSub: 'Tu registro está confirmado. ¡Nos da mucho gusto tenerte!',
    successProperty: 'Tu estancia en',
    successGuide: 'Ver Guía de tu Propiedad',
    successGuideDesc: 'WiFi, TV, caja fuerte, códigos de acceso y más — todo lo que necesitas para tu estancia',
    successContact: 'Te contactaremos pronto con los detalles de tu llegada.',
    error: 'Hubo un error. Por favor intente de nuevo.',
    required: 'Campos requeridos',
    flightFound: '¡Vuelo encontrado!',
    flightNotFound: 'Vuelo no encontrado. Puedes ingresar los datos manualmente.',
    flightSearching: 'Buscando vuelo...',
    flightRoute: 'Ruta',
    flightStatus: 'Estado',
    flightETA: 'Llegada estimada',
    flightStatuses: { scheduled: 'Programado', active: 'En Vuelo', landed: 'Aterrizó', cancelled: 'Cancelado', delayed: 'Retrasado', diverted: 'Desviado' },
    trackFlight: 'Rastrear este vuelo en vivo',
    noToken: 'Necesitas un enlace de check-in para acceder a esta página.',
    noTokenSub: 'Contacta a Castle Solutions para recibir tu enlace personalizado de check-in.',
    contactWhatsApp: 'Contáctanos por WhatsApp',
    invalidToken: 'Este enlace de check-in es inválido o ha expirado.',
  }
}

// Decode check-in token from URL
function decodeCheckinToken(tokenStr) {
  try {
    const decoded = atob(tokenStr)
    const data = JSON.parse(decoded)
    // Validate required fields
    if (!data.p) return null
    // Find matching property
    const property = PROPERTIES.find(prop => prop.id === data.p)
    if (!property) return null
    return {
      propertyId: data.p,
      propertyName: property.name,
      email: data.e || '',
      guestName: data.n || '',
      arrival: data.a || '',
      departure: data.d || '',
    }
  } catch {
    return null
  }
}

// Generate a check-in token (utility for admin use)
function encodeCheckinToken({ propertyId, email, guestName, arrival, departure }) {
  const data = { p: propertyId }
  if (email) data.e = email
  if (guestName) data.n = guestName
  if (arrival) data.a = arrival
  if (departure) data.d = departure
  return btoa(JSON.stringify(data))
}

function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDateShort(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function FlightCard({ flight, t, lang }) {
  const eta = flight.arrival.estimated || flight.arrival.scheduled
  const statusLabel = t.flightStatuses[flight.status] || flight.status
  const statusColors = {
    scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    landed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    delayed: 'bg-orange-50 text-orange-700 border-orange-200',
    diverted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  }

  return (
    <div className={`rounded-xl border-2 p-4 mt-3 fade-in ${statusColors[flight.status] || 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">✈️</span>
          <span className="font-bold font-mono">{flight.flight}</span>
          <span className="text-sm opacity-70">{flight.airline}</span>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
          {statusLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="opacity-60">{t.flightRoute}: </span>
          <span className="font-semibold">{flight.departure.iata} → {flight.arrival.iata}</span>
        </div>
        <div>
          <span className="opacity-60">{t.flightETA}: </span>
          <span className="font-semibold">{formatDateShort(eta)} {formatTime(eta)}</span>
        </div>
      </div>
      {flight.status === 'active' && (
        <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
          <div className="h-full bg-current rounded-full transition-all" style={{ width: `${flight.progress}%`, opacity: 0.6 }} />
        </div>
      )}
      <a
        href={`https://castle-flights.vercel.app?flight=${flight.flight}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-xs underline opacity-60 hover:opacity-100"
      >
        {t.trackFlight} →
      </a>
    </div>
  )
}

// No-token screen
function NoTokenScreen({ lang }) {
  const t = TEXTS[lang]
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center fade-in max-w-md mx-auto">
        <div className="mb-6">
          <img src="/logo.png" alt="Castle Solutions" className="h-20 mx-auto mb-6" />
        </div>
        
        <div className="text-6xl mb-4">🔒</div>
        
        <h1 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A' }}>
          {t.noToken}
        </h1>
        
        <p className="text-gray-600 mb-8">{t.noTokenSub}</p>
        
        <a
          href="https://wa.me/523221234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
          style={{ backgroundColor: '#25D366' }}
        >
          💬 {t.contactWhatsApp}
        </a>

        <div className="mt-6">
          <div className="flex justify-center mb-4">
            <div className="lang-toggle">
              <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => window.location.search = ''}>
                🇲🇽 Español
              </button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => window.location.search = ''}>
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-gray-500 hover:text-castle-gold transition-colors text-sm">
            {t.back}
          </Link>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Castle Solutions © {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">Puerto Vallarta, México</p>
          <p className="text-gray-400 text-xs mt-3">Hecho por <span style={{color: "#C9A227"}}>duendes.app</span> 2026</p>
        </div>
      </div>
    </div>
  )
}

function CheckinForm() {
  const searchParams = useSearchParams()
  const tokenStr = searchParams.get('t')
  
  const [lang, setLang] = useState('es')
  const [status, setStatus] = useState('idle')
  const [flightData, setFlightData] = useState(null)
  const [flightStatus, setFlightStatus] = useState('idle')
  const [tokenData, setTokenData] = useState(null)
  const [tokenChecked, setTokenChecked] = useState(false)
  const [formData, setFormData] = useState({
    property: '',
    guestName: '',
    numGuests: '',
    guestNames: '',
    phone: '',
    email: '',
    arrivalDate: '',
    arrivalTime: '',
    departureDate: '',
    departureTime: '',
    arrivalMethod: '',
    flightNumber: '',
    specialRequests: '',
  })

  // Decode token on mount
  useEffect(() => {
    if (tokenStr) {
      const decoded = decodeCheckinToken(tokenStr)
      if (decoded) {
        setTokenData(decoded)
        setFormData(prev => ({
          ...prev,
          property: decoded.propertyName,
          guestName: decoded.guestName || prev.guestName,
          email: decoded.email || prev.email,
          arrivalDate: decoded.arrival || prev.arrivalDate,
          departureDate: decoded.departure || prev.departureDate,
        }))
      }
    }
    setTokenChecked(true)
  }, [tokenStr])

  const t = TEXTS[lang]
  const isAirplane = formData.arrivalMethod === 'Airplane' || formData.arrivalMethod === 'Avión'

  const lookupFlight = useCallback(async (flightNum) => {
    const clean = flightNum.trim().replace(/\s/g, '').toUpperCase()
    if (clean.length < 3) { setFlightData(null); setFlightStatus('idle'); return }
    
    setFlightStatus('searching')
    try {
      const res = await fetch(`${FLIGHT_API}?flight=${clean}`)
      if (res.ok) {
        const data = await res.json()
        setFlightData(data)
        setFlightStatus('found')
        
        const eta = data.arrival.estimated || data.arrival.scheduled
        if (eta) {
          const d = new Date(eta)
          if (!isNaN(d)) {
            const dateStr = d.toISOString().split('T')[0]
            const timeStr = d.toTimeString().slice(0,5)
            setFormData(prev => ({
              ...prev,
              arrivalDate: prev.arrivalDate || dateStr,
              arrivalTime: prev.arrivalTime || timeStr,
            }))
          }
        }
      } else {
        setFlightData(null)
        setFlightStatus('not_found')
      }
    } catch {
      setFlightData(null)
      setFlightStatus('not_found')
    }
  }, [])

  useEffect(() => {
    if (!isAirplane || !formData.flightNumber || formData.flightNumber.length < 3) {
      setFlightData(null)
      setFlightStatus('idle')
      return
    }
    const timer = setTimeout(() => lookupFlight(formData.flightNumber), 800)
    return () => clearTimeout(timer)
  }, [formData.flightNumber, isAirplane, lookupFlight])

  const getPropertySlug = (propertyName) => {
    const prop = PROPERTIES.find(p => p.name === propertyName)
    return prop ? prop.id : ''
  }

  const getGuideUrl = () => {
    const slug = getPropertySlug(formData.property)
    const firstName = formData.guestName.split(' ')[0]
    return `https://castle-ops.castlesolutions.mx/guide/${slug}?guest=${encodeURIComponent(firstName)}&lang=${lang}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    const flightInfo = flightData
      ? `\n✈️ VUELO VERIFICADO: ${flightData.flight}\n   Ruta: ${flightData.departure.iata} → ${flightData.arrival.iata}\n   Status: ${flightData.status}\n   ETA: ${flightData.arrival.estimated || flightData.arrival.scheduled || 'N/A'}\n   Fuente: ${flightData.source}\n   🔗 Track: https://castle-flights.vercel.app?flight=${flightData.flight}`
      : ''

    const emailBody = `
🏠 NUEVO CHECK-IN - CASTLE SOLUTIONS

📍 PROPIEDAD: ${formData.property}

👤 HUÉSPED PRINCIPAL
Nombre: ${formData.guestName}
Teléfono: ${formData.phone}
Email: ${formData.email}

👥 HUÉSPEDES
Número: ${formData.numGuests}
Nombres: ${formData.guestNames || 'No especificado'}

📅 FECHAS
Llegada: ${formData.arrivalDate} a las ${formData.arrivalTime}
Salida: ${formData.departureDate}

🚗 MÉTODO DE LLEGADA: ${formData.arrivalMethod}
${formData.flightNumber ? '✈️ Vuelo: ' + formData.flightNumber : ''}${flightInfo}

📝 PETICIONES ESPECIALES:
${formData.specialRequests || 'Ninguna'}

---
Enviado: ${new Date().toLocaleString('es-MX')}
    `.trim()

    try {
      const response = await fetch('https://email-service-pvrolomxs-projects.vercel.app/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'reservations@castlesolutions.biz',
          subject: `🏠 Nuevo Check-in: ${formData.property} - ${formData.guestName}${flightData ? ' ✈️' + flightData.flight : ''}`,
          name: 'Castle Solutions Check-in',
          message: emailBody,
          from: formData.email
        })
      })

      const result = await response.json()
      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  // Loading state while checking token
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  // No token provided — block access
  if (!tokenStr) {
    return <NoTokenScreen lang={lang} />
  }

  // Invalid token
  if (tokenStr && !tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center fade-in max-w-md mx-auto">
          <div className="mb-6">
            <img src="/logo.png" alt="Castle Solutions" className="h-20 mx-auto mb-6" />
          </div>
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A' }}>
            {t.invalidToken}
          </h1>
          <p className="text-gray-600 mb-8">{t.noTokenSub}</p>
          <a
            href="https://wa.me/523221234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            style={{ backgroundColor: '#25D366' }}
          >
            💬 {t.contactWhatsApp}
          </a>
          <div className="mt-8">
            <Link href="/" className="text-gray-500 hover:text-castle-gold transition-colors text-sm">
              {t.back}
            </Link>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Castle Solutions © {new Date().getFullYear()}</p>
            <p className="text-gray-400 text-xs mt-3">Hecho por <span style={{color: "#C9A227"}}>duendes.app</span> 2026</p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    const firstName = formData.guestName.split(' ')[0]
    const guideUrl = getGuideUrl()

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center fade-in max-w-md mx-auto">
          <div className="mb-6">
            <img src="/logo.png" alt="Castle Solutions" className="h-20 mx-auto mb-6" />
          </div>
          
          <div className="text-6xl mb-4 text-green-500">✓</div>
          
          <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {lang === 'en' ? `Congratulations, ${firstName}!` : `¡Felicidades, ${firstName}!`}
          </h1>
          
          <p className="text-xl mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A227' }}>
            {t.successTitle}
          </p>
          
          <p className="text-gray-600 mb-2">{t.successSub}</p>
          
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 my-6 text-white shadow-xl">
            <div className="text-3xl mb-2">🏰</div>
            <p className="text-sm text-gray-400 mb-1">{t.successProperty}</p>
            <p className="text-xl font-semibold" style={{ color: '#C9A227', fontFamily: 'Cormorant Garamond, serif' }}>
              {formData.property}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.4)' }}></span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A227' }}></span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,162,39,0.4)' }}></span>
            </div>
          </div>

          {/* Flight tracking section */}
          {flightData ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mb-6 text-white shadow-lg text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Your flight' : 'Tu vuelo'}</p>
                    <p className="font-bold font-mono text-lg">{flightData.flight}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  flightData.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  flightData.status === 'landed' ? 'bg-blue-500/20 text-blue-300' :
                  flightData.status === 'delayed' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {t.flightStatuses[flightData.status] || flightData.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <p className="font-bold text-lg">{flightData.departure.iata}</p>
                  <p className="text-xs text-gray-400">{formatTime(flightData.departure.scheduled)}</p>
                </div>
                <div className="flex-1 relative">
                  <div className="h-0.5 bg-gray-600 rounded-full">
                    <div className="h-full rounded-full transition-all duration-1000" style={{
                      width: `${flightData.progress}%`,
                      background: 'linear-gradient(90deg, #C4A265, #E8D5A8)'
                    }} />
                  </div>
                  {flightData.status === 'active' && (
                    <span className="absolute top-1/2 -translate-y-1/2 text-sm" style={{ left: `${flightData.progress}%`, transform: `translateX(-50%) translateY(-50%)` }}>✈️</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{flightData.arrival.iata}</p>
                  <p className="text-xs text-gray-400">{formatTime(flightData.arrival.estimated || flightData.arrival.scheduled)}</p>
                </div>
              </div>
              {flightData.arrival.terminal && (
                <p className="text-xs text-gray-400 mb-2">Terminal {flightData.arrival.terminal}{flightData.arrival.gate ? ` · Gate ${flightData.arrival.gate}` : ''}</p>
              )}
              <a
                href={`https://castle-flights.vercel.app?flight=${flightData.flight}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded-xl text-sm font-medium transition-colors mt-2"
                style={{ backgroundColor: 'rgba(196,162,101,0.2)', color: '#E8D5A8' }}
              >
                {t.trackFlight} →
              </a>
            </div>
          ) : isAirplane && formData.flightNumber ? (
            <a
              href={`https://castle-flights.vercel.app?flight=${formData.flightNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200 hover:border-castle-gold hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl block mb-1">✈️</span>
              <p className="font-medium text-gray-700">{t.trackFlight}</p>
              <p className="text-sm text-gray-400 font-mono">{formData.flightNumber.toUpperCase()}</p>
            </a>
          ) : (
            <a
              href="https://castle-flights.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200 hover:border-castle-gold hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl block mb-1">✈️</span>
              <p className="font-medium text-gray-700">{lang === 'en' ? 'Track Your Flight' : 'Rastrea Tu Vuelo'}</p>
              <p className="text-xs text-gray-400">{lang === 'en' ? 'Enter your flight number to track it live' : 'Ingresa tu número de vuelo para rastrearlo en vivo'}</p>
            </a>
          )}
          
          <a
            href={guideUrl}
            className="block w-full text-center text-white font-semibold py-4 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] mb-3"
            style={{ backgroundColor: '#C9A227' }}
          >
            📖 {t.successGuide}
          </a>
          <p className="text-gray-500 text-sm mb-6">{t.successGuideDesc}</p>
          
          <p className="text-gray-400 text-sm mb-8">{t.successContact}</p>
          
          <Link href="/" className="btn-secondary">
            {t.back}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-gray-500 hover:text-castle-gold transition-colors text-sm">
            {t.back}
          </Link>
        </div>

        <div className="text-center mb-8 fade-in">
          <div className="flex justify-center mb-6">
            <div className="lang-toggle">
              <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>
                🇲🇽 Español
              </button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
                🇺🇸 English
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <img src="/logo.png" alt="Castle Solutions" className="h-20 md:h-24 mx-auto" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A' }}>
            {t.title}
          </h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Property — locked from token, shown as read-only */}
            <div>
              <label className="form-label">{t.propertyLabel} *</label>
              <div className="form-input bg-gray-50 flex items-center gap-2" style={{ cursor: 'default' }}>
                <span>🏰</span>
                <span className="font-semibold">{tokenData.propertyName}</span>
              </div>
              <input type="hidden" name="property" value={formData.property} />
            </div>

            <div>
              <label className="form-label">{t.guestName} *</label>
              <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required className="form-input" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">{t.numGuests} *</label>
                <input type="number" name="numGuests" min="1" max="20" value={formData.numGuests} onChange={handleChange} required className="form-input" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">{t.guestNames}</label>
                <input type="text" name="guestNames" value={formData.guestNames} onChange={handleChange} placeholder={t.guestNamesPlaceholder} className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.phone} *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">{t.email} *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.arrivalDate} *</label>
                <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">{t.arrivalTime} *</label>
                <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.departureDate} *</label>
                <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required className="form-input" />
              </div>
              <div>
                <label className="form-label">{t.departureTime}</label>
                <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} className="form-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.arrivalMethod} *</label>
                <select name="arrivalMethod" value={formData.arrivalMethod} onChange={handleChange} required className="form-input">
                  <option value="">--</option>
                  {ARRIVAL_METHODS[lang].map(method => (<option key={method} value={method}>{method}</option>))}
                </select>
              </div>
              
              {isAirplane && (
                <div className="fade-in">
                  <label className="form-label">{t.flightNumber}</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      placeholder={t.flightPlaceholder}
                      className="form-input font-mono"
                    />
                    {flightStatus === 'searching' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 animate-pulse">🔍</span>
                    )}
                    {flightStatus === 'found' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-500">✅</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Flight validation card */}
            {isAirplane && flightStatus === 'searching' && (
              <div className="bg-gray-50 rounded-xl p-3 text-center text-sm text-gray-500 animate-pulse">
                🔍 {t.flightSearching}
              </div>
            )}
            {isAirplane && flightStatus === 'found' && flightData && (
              <FlightCard flight={flightData} t={t} lang={lang} />
            )}
            {isAirplane && flightStatus === 'not_found' && formData.flightNumber.length >= 3 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center text-sm text-yellow-700">
                ⚠️ {t.flightNotFound}
              </div>
            )}

            <div>
              <label className="form-label">{t.specialRequests}</label>
              <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="3" placeholder={t.specialPlaceholder} className="form-input" style={{ resize: 'vertical' }} />
            </div>

            <div className="pt-4">
              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
                {status === 'submitting' ? t.submitting : t.submit}
              </button>
              
              {status === 'error' && (<p className="text-red-500 text-center mt-4">{t.error}</p>)}
              
              <p className="text-center text-gray-400 text-xs mt-4">* {t.required}</p>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Castle Solutions © {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">Puerto Vallarta, México</p>
          <p className="text-gray-400 text-xs mt-3">Hecho por <span style={{color: "#C9A227"}}>duendes.app</span> 2026</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <CheckinForm />
    </Suspense>
  )
}
