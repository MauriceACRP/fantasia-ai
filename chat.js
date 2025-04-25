import { NextResponse } from 'next/server';

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ reply: 'Messaggio mancante.' }, { status: 400 });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'Sei un assistente virtuale per un'agenzia viaggi di Palermo chiamata Fantasia Viaggi. Dai risposte professionali, utili e brevi.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.error }, { status: response.status });
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'Errore nella risposta AI.';
  return NextResponse.json({ reply });
}
