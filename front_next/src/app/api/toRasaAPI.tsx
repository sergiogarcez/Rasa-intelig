import { v4 as uuidv4 } from 'uuid';

const senderId = uuidv4(); // Gera um ID único para cada sessão de usuário

export async function sendRasaMessage(message: string) {
  try {
    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API do Rasa: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha na comunicação com o Rasa:', error);
    throw error;
  }
}