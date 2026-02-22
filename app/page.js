'use client'

import { useState, useEffect } from 'react'

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A', location: 'Marina Vallarta', beds: 2, baths: 2, guests: 4, photo: '/properties/villa-magna-253b.jpg' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B', location: 'Marina Vallarta', beds: 2, baths: 2, guests: 4, photo: '/properties/villa-magna-253a.jpg' },
  { id: 'villa-magna-336', name: 'Villa Magna 336', location: 'Nuevo Nayarit', beds: 3, baths: 3, guests: 6, image: '🏖️' },
  { id: 'estrella-502', name: 'V Estrella 502', location: 'Alta Vista', beds: 3, baths: 3, guests: 6, image: '⭐' },
  { id: 'casita-1', name: 'Casita 1', location: 'Centro / Malecón', beds: 1, baths: 2, guests: 3, image: '🏠' },
  { id: 'casita-2', name: 'Casita 2', location: 'Centro / Malecón', beds: 1, baths: 2, guests: 3, image: '🏠' },
  { id: 'nitta-102', name: 'Nitta 102', location: 'Zona Romántica', beds: 1, baths: 1, guests: 2, image: '🌴' },
  { id: 'mismaloya-7202', name: 'Mismaloya 7202', location: 'Mismaloya', beds: 2, baths: 2, guests: 5, photo: '/properties/mismaloya-7202.jpg' },
  { id: 'mismaloya-5705', name: 'Mismaloya 5705', location: 'Mismaloya', beds: 2, baths: 2, guests: 5, photo: '/properties/mismaloya-5705.jpg' },
  { id: 'avida-408', name: 'Avida 408', location: 'Fluvial Vallarta', beds: 2, baths: 2, guests: 3, image: '🌺' },
  { id: 'cielo-101', name: 'Cielo 101', location: 'Alta Vista', beds: 2, baths: 2, guests: 4, image: '☁️' },
]

const TEXTS = {
  en: {
    hero: 'Your Home Away From Home',
    heroSub: 'Premium vacation rentals in Puerto Vallarta',
    properties: 'Our Properties',
    beds: 'Beds',
    baths: 'Baths',
    guests: 'Guests',
    checkin: 'Guest Check-in',
    checkinDesc: 'Already booked? Complete your registration',
    checkinBtn: 'Go to Check-in',
    contact: 'Contact Us',
    contactDesc: 'Questions about our properties?',
    phone: 'WhatsApp',
    email: 'Email',
    footer: 'Puerto Vallarta, Jalisco, México',
    rights: 'All rights reserved',
    install: 'Install App',
    madeWith: 'Made with',
    by: 'by',
  },
  es: {
    hero: 'Tu Hogar Lejos de Casa',
    heroSub: 'Rentas vacacionales premium en Puerto Vallarta',
    properties: 'Nuestras Propiedades',
    beds: 'Recámaras',
    baths: 'Baños',
    guests: 'Huéspedes',
    checkin: 'Registro de Huésped',
    checkinDesc: '¿Ya reservaste? Completa tu registro',
    checkinBtn: 'Ir al Check-in',
    contact: 'Contáctanos',
    contactDesc: '¿Preguntas sobre nuestras propiedades?',
    phone: 'WhatsApp',
    email: 'Correo',
    footer: 'Puerto Vallarta, Jalisco, México',
    rights: 'Todos los derechos reservados',
    install: 'Instalar App',
    madeWith: 'Hecho con',
    by: 'por',
  }
}

export default function HomePage() {
  const [lang, setLang] = useState('es')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const t = TEXTS[lang]

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-gray-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Castle Solutions</span>
          <div className="flex items-center gap-3">
            <div className="lang-toggle">
              <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>🇲🇽</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇺🇸</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 hero-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <img 
            src="/logo.png" 
            alt="Castle Solutions" 
            className="h-32 md:h-40 mx-auto mb-8 fade-in drop-shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-semibold mb-4 fade-in" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#1A1A1A', animationDelay: '0.1s' }}>
            {t.hero}
          </h1>
          <p className="text-xl text-gray-600 mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: '0.3s' }}>
            <a href="#properties" className="btn-primary inline-block">{t.properties}</a>
            <a href="/checkin" className="btn-secondary inline-block">{t.checkinBtn}</a>
          </div>
          
          {showInstall && (
            <button 
              onClick={handleInstall} 
              className="mt-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-medium transition-all fade-in flex items-center gap-2 mx-auto"
              style={{ animationDelay: '0.4s' }}
            >
              📲 {t.install}
            </button>
          )}
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {t.properties}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTIES.map((prop, i) => (
              <div key={prop.id} className="property-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {prop.photo ? (
                  <div className="property-image" style={{ backgroundImage: `url(${prop.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                ) : (
                  <div className="property-image"><span className="text-5xl">{prop.image}</span></div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{prop.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">📍 {prop.location}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {prop.beds} {t.beds}</span>
                    <span>🚿 {prop.baths} {t.baths}</span>
                    <span>👥 {prop.guests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Check-in CTA */}
      <section className="py-16 px-4 bg-castle-sand">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{t.checkin}</h2>
          <p className="text-gray-600 mb-6">{t.checkinDesc}</p>
          <a href="/checkin" className="btn-primary inline-block">{t.checkinBtn} →</a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{t.contact}</h2>
          <p className="text-gray-600 mb-8">{t.contactDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/523221234567" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <span className="text-2xl">💬</span><span>{t.phone}</span>
            </a>
            <a href="mailto:claudia@castlesolutions.biz" className="contact-btn">
              <span className="text-2xl">✉️</span><span>{t.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-castle-dark text-white">
        <div className="max-w-6xl mx-auto text-center">
          <img src="/logo.png" alt="Castle Solutions" className="h-12 mx-auto mb-4 brightness-200" style={{ filter: 'brightness(2)' }} />
          <p className="text-gray-400 text-sm mb-2">{t.footer}</p>
          <p className="text-gray-500 text-xs mb-4">
            © {new Date().getFullYear()} Castle Solutions. {t.rights}.
          </p>
          <p className="text-gray-600 text-xs">
            {t.madeWith} ❤️ {t.by} <span className="text-castle-gold">duendes.app</span> 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
