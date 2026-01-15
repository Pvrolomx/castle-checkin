import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const data = await request.json()
    
    const emailBody = `
🏠 NUEVO CHECK-IN - CASTLE SOLUTIONS
=====================================

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
   Salida: ${data.departureDate}${data.departureTime ? ' a las ' + data.departureTime : ''}

🚗 MÉTODO DE LLEGADA: ${data.arrivalMethod}
${data.flightNumber ? '   ✈️ Vuelo: ' + data.flightNumber : ''}

📝 PETICIONES ESPECIALES:
${data.specialRequests || 'Ninguna'}

=====================================
Enviado: ${new Date(data.submittedAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
    `.trim()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Castle Solutions <onboarding@resend.dev>',
        to: ['claudia@castlesolutions.biz'],
        subject: `🏠 Nuevo Check-in: ${data.property} - ${data.guestName}`,
        text: emailBody,
        reply_to: data.email
      })
    })

    if (res.ok) {
      return NextResponse.json({ success: true })
    } else {
      const error = await res.json()
      console.error('Resend error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
