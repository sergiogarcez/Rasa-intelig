'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState } from 'react';
import ChatInput from './chatInput';
import { sendRasaMessage } from '../api/toRasaAPI';



// Interface para as mensagens, definir o texto e se veio do usuario ou nao;
interface Message {
  text: string;
  fromUser: boolean;
}
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (message: string) => {
    // Adiciona a mensagem do usuário imediatamente na interface
    const userMessage: Message = { text: message, fromUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Envia a mensagem para o Rasa e espera a resposta
    try {
      const rasaResponse = await sendRasaMessage(message);

      // Adiciona a resposta do Rasa à interface
      if (rasaResponse && rasaResponse.length > 0) {
        rasaResponse.forEach((rasaMsg: { text: any; }) => {
          const botMessage: Message = { text: rasaMsg.text, fromUser: false };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        });
      }
    } catch (error) {
      console.error("Erro ao comunicar com o Rasa:", error);
      const errorMessage: Message = { text: "Desculpe, não consigo me conectar ao assistente.", fromUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 h-full">
      {/* Container da conversa */}
      <div className="flex-1 overflow-y-auto mb-4">
        <ScrollArea.Root className="h-full">
          <ScrollArea.Viewport className="h-full">
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.fromUser
                      ? 'self-end bg-blue-500 text-white'
                      : 'self-start bg-gray-300 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar className="w-2" orientation="vertical">
            <ScrollArea.Thumb className="bg-gray-400 rounded" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* Área de entrada de texto e botões */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;