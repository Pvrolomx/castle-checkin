'use client'

import { useState, useEffect, useCallback } from 'react'

const GALLERY = {
  'villa-magna-253a': [
    '/gallery/villa-magna-253a-living.jpg',
    '/gallery/villa-magna-253a-dining.jpg',
    '/gallery/villa-magna-253a-bedroom.jpg',
    '/gallery/villa-magna-253a-bedroom2.jpg',
    '/gallery/villa-magna-253a-kitchen.jpg',
    '/gallery/villa-magna-253a-bathroom.jpg',
    '/gallery/villa-magna-253a-balcony.jpg',
    '/gallery/villa-magna-253a-laundry.jpg',
    '/gallery/villa-magna-253a-pool-beach.jpg',
  ],
  'mismaloya-7202': [
    '/gallery/mismaloya-7202-bay-view.jpg',
    '/gallery/mismaloya-7202-living.jpg',
    '/gallery/mismaloya-7202-living2.jpg',
    '/gallery/mismaloya-7202-dining.jpg',
    '/gallery/mismaloya-7202-kitchen.jpg',
    '/gallery/mismaloya-7202-kitchen2.jpg',
    '/gallery/mismaloya-7202-bedroom.jpg',
    '/gallery/mismaloya-7202-bathroom.jpg',
    '/gallery/mismaloya-7202-pool.jpg',
    '/gallery/mismaloya-7202-gym.jpg',
    '/gallery/mismaloya-7202-courtyard.jpg',
  ],
  'mismaloya-5705': [
    '/gallery/mismaloya-5705-balcony.jpg',
    '/gallery/mismaloya-5705-living.jpg',
    '/gallery/mismaloya-5705-dining.jpg',
    '/gallery/mismaloya-5705-kitchen.jpg',
    '/gallery/mismaloya-5705-bedroom.jpg',
    '/gallery/mismaloya-5705-pool-aerial.jpg',
  ],
  'villa-magna-336': [
    '/gallery/villa-magna-336-balcony-bbq.jpg',
    '/gallery/villa-magna-336-balcony2.jpg',
    '/gallery/villa-magna-336-hallway.jpg',
    '/gallery/villa-magna-336-kitchen.jpg',
    '/gallery/villa-magna-336-kitchen2.jpg',
    '/gallery/villa-magna-336-bedroom1.jpg',
    '/gallery/villa-magna-336-bedroom1-detail.jpg',
    '/gallery/villa-magna-336-bedroom2.jpg',
    '/gallery/villa-magna-336-bunkbed.jpg',
    '/gallery/villa-magna-336-bathroom.jpg',
  ],
  'estrella-502': [
    '/gallery/estrella-502-living.jpg',
    '/gallery/estrella-502-living-sunset.jpg',
    '/gallery/estrella-502-panoramic.jpg',
    '/gallery/estrella-502-dining.jpg',
    '/gallery/estrella-502-kitchen.jpg',
    '/gallery/estrella-502-bar.jpg',
    '/gallery/estrella-502-bedroom1.jpg',
    '/gallery/estrella-502-bedroom2.jpg',
    '/gallery/estrella-502-bathroom.jpg',
    '/gallery/estrella-502-pool-sunset.jpg',
    '/gallery/estrella-502-gym.jpg',
  ],
  'casita-1': [
    '/gallery/casita-1-living.jpg',
    '/gallery/casita-1-loft.jpg',
    '/gallery/casita-1-bedroom.jpg',
    '/gallery/casita-1-bathroom.jpg',
    '/gallery/casita-1-bathroom2.jpg',
    '/gallery/casita-1-pool.jpg',
    '/gallery/casita-1-laundry.jpg',
  ],
  'casita-2': [
    '/gallery/casita-2-loft.jpg',
    '/gallery/casita-2-living.jpg',
    '/gallery/casita-2-living2.jpg',
    '/gallery/casita-2-patio-pool.jpg',
    '/gallery/casita-2-kitchen.jpg',
    '/gallery/casita-2-bedroom.jpg',
    '/gallery/casita-2-bedroom2.jpg',
    '/gallery/casita-2-bedroom-view.jpg',
    '/gallery/casita-2-bedroom3.jpg',
    '/gallery/casita-2-pool.jpg',
    '/gallery/casita-2-laundry.jpg',
  ],
  'nitta-102': [
    '/gallery/nitta-102-kitchen.jpg',
    '/gallery/nitta-102-kitchen2.jpg',
    '/gallery/nitta-102-dining.jpg',
    '/gallery/nitta-102-living.jpg',
    '/gallery/nitta-102-bedroom.jpg',
    '/gallery/nitta-102-balcony.jpg',
    '/gallery/nitta-102-balcony2.jpg',
  ],
  'avida-408': [
    '/gallery/avida-408-living.jpg',
    '/gallery/avida-408-living-sunset.jpg',
    '/gallery/avida-408-panoramic.jpg',
    '/gallery/avida-408-kitchen-bar.jpg',
    '/gallery/avida-408-kitchen.jpg',
    '/gallery/avida-408-kitchen2.jpg',
    '/gallery/avida-408-bedroom.jpg',
    '/gallery/avida-408-rooftop.jpg',
  ],
}

const PROPERTIES = [
  { id: 'villa-magna-253a', name: 'Villa Magna 253 A', location: 'Marina Vallarta', beds: 2, baths: 2, guests: 4, photo: '/properties/villa-magna-253a.jpg' },
  { id: 'villa-magna-253b', name: 'Villa Magna 253 B', location: 'Marina Vallarta', beds: 2, baths: 2, guests: 4, photo: '/properties/villa-magna-253b.jpg' },
  { id: 'villa-magna-336', name: 'Villa Magna 336', location: 'Nuevo Nayarit', beds: 3, baths: 3, guests: 6, photo: '/properties/villa-magna-336.jpg' },
  { id: 'estrella-502', name: 'V Estrella 502', location: 'Alta Vista', beds: 3, baths: 3, guests: 6, photo: '/properties/estrella-502.jpg' },
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
    photos: 'photos',
    viewGallery: 'View Gallery',
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
    photos: 'fotos',
    viewGallery: 'Ver Galería',
  }
}

function GalleryModal({ images, propertyName, onClose, startIndex = 0 }) {
  const [current, setCurrent] = useState(startIndex)

  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, next, prev])

  let touchStartX = 0
  const onTouchStart = (e) => { touchStartX = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-medium truncate" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{propertyName}</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{current + 1} / {images.length}</span>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-300 transition-colors w-10 h-10 flex items-center justify-center">&times;</button>
        </div>
      </div>

      {/* Image */}
      <div 
        className={"flex-1 flex items-center justify-center px-4 relative"}
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button 
          onClick={prev} 
          className="absolute left-2 md:left-6 text-white/70 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm transition-all"
        >
          ‹
        </button>
        
        <img
          src={images[current]}
          alt={`${propertyName} ${current + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
          style={{ transition: 'opacity 0.2s' }}
        />
        
        <button 
          onClick={next} 
          className="absolute right-2 md:right-6 text-white/70 hover:text-white text-4xl z-10 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-sm transition-all"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className={"px-4 py-3 overflow-x-auto"} onClick={e => e.stopPropagation()}>
        <div className="flex gap-2 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-md overflow-hidden border-2 transition-all ${
                i === current ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [lang, setLang] = useState('es')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(null)
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

  const openGallery = (propId, propName) => {
    if (GALLERY[propId]) {
      setGalleryOpen({ id: propId, name: propName, images: GALLERY[propId] })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Gallery Modal */}
      {galleryOpen && (
        <GalleryModal
          images={galleryOpen.images}
          propertyName={galleryOpen.name}
          onClose={() => setGalleryOpen(null)}
        />
      )}

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
            {PROPERTIES.map((prop, i) => {
              const hasGallery = !!GALLERY[prop.id]
              return (
                <div 
                  key={prop.id} 
                  className={`property-card fade-in ${hasGallery ? 'cursor-pointer' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => hasGallery && openGallery(prop.id, prop.name)}
                >
                  {prop.photo ? (
                    <div className="property-image relative" style={{ backgroundImage: `url(${prop.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      {hasGallery && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                          📷 {GALLERY[prop.id].length} {t.photos}
                        </div>
                      )}
                    </div>
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
              )
            })}
          </div>
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
            {t.madeWith} ❤️ {t.by} <span className="text-castle-gold">duendes.app</span> <a href="/generate" className="text-gray-600 hover:text-gray-500 transition-colors">2026</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
