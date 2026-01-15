'use client'

import { useState } from 'react'

const PROPERTIES = [
  { id: 'casa-del-mar', name: 'Casa del Mar' },
  { id: 'villa-sunset', name: 'Villa Sunset' },
  { id: 'hacienda-real', name: 'Hacienda Real' },
  { id: 'casa-paloma', name: 'Casa Paloma' },
  { id: 'villa-serena', name: 'Villa Serena' },
  { id: 'casa-bella', name: 'Casa Bella' },
  { id: 'villa-paraiso', name: 'Villa Paraíso' },
]

const ARRIVAL_METHODS = {
  en: ['Airplane', 'Car', 'Bus', 'Other'],
  es: ['Avión', 'Auto', 'Autobús', 'Otro']
}

const TEXTS = {
  en: {
    title: 'Guest Check-in',
    subtitle: 'Welcome to Castle Solutions',
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
    success: 'Thank you! Your check-in has been received.',
    successSub: 'We will contact you shortly with arrival details.',
    error: 'There was an error. Please try again.',
    required: 'Required fields',
  },
  es: {
    title: 'Registro de Huésped',
    subtitle: 'Bienvenido a Castle Solutions',
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
    success: '¡Gracias! Su registro ha sido recibido.',
    successSub: 'Nos pondremos en contacto con los detalles de llegada.',
    error: 'Hubo un error. Por favor intente de nuevo.',
    required: 'Campos requeridos',
  }
}

export default function CheckinForm() {
  const [lang, setLang] = useState('es')
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      // Send to formspree or similar service
      const response = await fetch('https://formspree.io/f/xpwzgkvq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language: lang,
          submittedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center fade-in">
          <div className="text-6xl mb-6">🏠</div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t.success}
          </h1>
          <p className="text-gray-600">{t.successSub}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex justify-center mb-6">
            <div className="lang-toggle">
              <button
                className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
                onClick={() => setLang('es')}
              >
                🇲🇽 Español
              </button>
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <span className="text-5xl">🏰</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A' }}>
            {t.title}
          </h1>
          <p className="text-gray-600 text-lg">{t.subtitle}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Property Select */}
            <div>
              <label className="form-label">{t.property} *</label>
              <select
                name="property"
                value={formData.property}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">--</option>
                {PROPERTIES.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Guest Name */}
            <div>
              <label className="form-label">{t.guestName} *</label>
              <input
                type="text"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Number of Guests & Names */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">{t.numGuests} *</label>
                <input
                  type="number"
                  name="numGuests"
                  min="1"
                  max="20"
                  value={formData.numGuests}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">{t.guestNames}</label>
                <input
                  type="text"
                  name="guestNames"
                  value={formData.guestNames}
                  onChange={handleChange}
                  placeholder={t.guestNamesPlaceholder}
                  className="form-input"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.phone} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t.email} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Arrival Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.arrivalDate} *</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t.arrivalTime} *</label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Departure Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.departureDate} *</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t.departureTime}</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Arrival Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t.arrivalMethod} *</label>
                <select
                  name="arrivalMethod"
                  value={formData.arrivalMethod}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">--</option>
                  {ARRIVAL_METHODS[lang].map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              {/* Flight Number - only shows if Airplane selected */}
              {isAirplane && (
                <div className="fade-in">
                  <label className="form-label">{t.flightNumber}</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    placeholder={t.flightPlaceholder}
                    className="form-input"
                  />
                </div>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="form-label">{t.specialRequests}</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
                placeholder={t.specialPlaceholder}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary"
              >
                {status === 'submitting' ? t.submitting : t.submit}
              </button>
              
              {status === 'error' && (
                <p className="text-red-500 text-center mt-4">{t.error}</p>
              )}
              
              <p className="text-center text-gray-400 text-xs mt-4">* {t.required}</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Castle Solutions © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
