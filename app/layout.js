import './globals.css'

export const metadata = {
  title: 'Castle Solutions - Vacation Rentals Puerto Vallarta',
  description: 'Premium vacation rentals in Puerto Vallarta, Mexico',
  manifest: '/manifest.json',
  themeColor: '#C9A227',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Castle Solutions',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        {/* Install Button - Fixed Bottom */}
        <div id="install-container" className="hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button id="install-btn" className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg text-sm font-medium transition-all">
            <span>📲</span> Install App
          </button>
        </div>
        
        {children}
        
        <script dangerouslySetInnerHTML={{ __html: `
          // Service Worker
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {})
          }
          
          // PWA Install Prompt
          let deferredPrompt;
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('install-container').classList.remove('hidden');
          });
          
          document.getElementById('install-btn')?.addEventListener('click', () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(r => {
              if (r.outcome === 'accepted') {
                document.getElementById('install-container').classList.add('hidden');
              }
              deferredPrompt = null;
            });
          });
          
          window.addEventListener('appinstalled', () => {
            document.getElementById('install-container').classList.add('hidden');
          });
        `}} />
      </body>
    </html>
  )
}
