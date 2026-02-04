'use client'

import { useState } from 'react'
import Link from 'next/link'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B' },
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

const TEXTS = {
  en: {
    back: '← Back to Home',
    title: 'Guest Check-in',
    subtitle: 'Welcome! Please complete this form before your arrival',
    property: 'Select Property',
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
  },
  es: {
    back: '← Volver al Inicio',
    title: 'Registro de Huésped',
    subtitle: '¡Bienvenido! Por favor complete este formulario antes de su llegada',
    property: 'Seleccionar Propiedad',
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
  }
}

export default function CheckinPage() {
  const [lang, setLang] = useState('es')
  const [status, setStatus] = useState('idle')
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

  const t = TEXTS[lang]
  const isAirplane = formData.arrivalMethod === 'Airplane' || formData.arrivalMethod === 'Avión'

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
${formData.flightNumber ? '✈️ Vuelo: ' + formData.flightNumber : ''}

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
          subject: `🏠 Nuevo Check-in: ${formData.property} - ${formData.guestName}`,
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

  if (status === 'success') {
    const firstName = formData.guestName.split(' ')[0]
    const guideUrl = getGuideUrl()

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center fade-in max-w-md mx-auto">
          <div className="mb-6">
            <img src="/logo.png" alt="Castle Solutions" className="h-20 mx-auto mb-6" />
          </div>
          
          {/* Animated checkmark */}
          <div className="text-6xl mb-4 text-green-500">✓</div>
          
          {/* Personalized welcome */}
          <h1 className="text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {lang === 'en' ? `Congratulations, ${firstName}!` : `¡Felicidades, ${firstName}!`}
          </h1>
          
          <p className="text-xl mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#C9A227' }}>
            {t.successTitle}
          </p>
          
          <p className="text-gray-600 mb-2">{t.successSub}</p>
          
          {/* Property card */}
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
          
          {/* Guide CTA */}
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
            
            <div>
              <label className="form-label">{t.property} *</label>
              <select name="property" value={formData.property} onChange={handleChange} required className="form-input">
                <option value="">--</option>
                {PROPERTIES.map(p => (<option key={p.id} value={p.name}>{p.name}</option>))}
              </select>
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
                  <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange} placeholder={t.flightPlaceholder} className="form-input" />
                </div>
              )}
            </div>

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
