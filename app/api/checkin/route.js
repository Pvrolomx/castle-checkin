import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    
    const emailContent = `
🏠 NUEVO CHECK-IN - CASTLE SOLUTIONS

📍 PROPIEDAD: ${data.property}

👤 HUÉSPED PRINCIPAL
Nombre: ${data.guestName}
Teléfono: ${data.phone}
Email: ${data.email}

👥 HUÉSPEDES
Número: ${data.numGuests}
Nombres: ${data.guestNames || 'No especificado'}

📅 FECHAS
Llegada: ${data.arrivalDate} a las ${data.arrivalTime}
Salida: ${data.departureDate} ${data.departureTime ? 'a las ' + data.departureTime : ''}

🚗 MÉTODO DE LLEGADA: ${data.arrivalMethod}
${data.flightNumber ? '✈️ Vuelo: ' + data.flightNumber : ''}

📝 PETICIONES ESPECIALES:
${data.specialRequests || 'Ninguna'}

---
Enviado: ${new Date(data.submittedAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
    `.trim()

    // Web3Forms
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `🏠 Nuevo Check-in: ${data.property} - ${data.guestName}`,
        from_name: 'Castle Solutions Check-in',
        to: 'claudia@castlesolutions.biz',
        message: emailContent,
        replyto: data.email
      })
    })

    const result = await res.json()
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error('Web3Forms error:', result)
      return NextResponse.json({ success: false }, { status: 500 })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
