'use client';

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { sendRasaMessage } from '../api/toRasaAPI';



// Interface para as mensagens, definir o texto e se veio do usuario ou nao;
interface Message {
  text: string;
  fromUser: boolean;
}
const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => { scrollToBottom();
      }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Adiciona a mensagem do usuário imediatamente na interface
    const userMessage: Message = { text: inputMessage, fromUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');

    try {
      // Envia a mensagem para o Rasa e espera a resposta
      const rasaResponse = await sendRasaMessage(inputMessage);

      // Adiciona a resposta do Rasa à interface
      if (rasaResponse && rasaResponse.length > 0) {
        rasaResponse.forEach((rasaMsg: any) => {
          const botMessage: Message = { text: rasaMsg.text, fromUser: false };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        });
      }
    } catch (error) {
      console.error('Erro ao comunicar com o Rasa:', error);
      const errorMessage: Message = {
        text: 'Desculpe, não consigo me conectar ao assistente.',
        fromUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* 1. Navegação Lateral Esquerda */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-8">Navegação</h1>
        <nav className="flex flex-col gap-4 w-full">
          <a href="#" className="p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center">
            Novo Chat
          </a>
          <a href="#" className="p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center">
            Histórico
          </a>
          <a href="#" className="p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-center">
            Configurações
          </a>
        </nav>
      </aside>

      {/* 2. Área Central do Chat (Conteúdo Principal) */}
      <main className="flex-1 flex flex-col bg-white rounded-lg shadow-lg m-6">
        <div className="flex-1 flex flex-col overflow-y-auto p-6"> {/* CORRIGIDO */}
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl max-w-[70%] break-words ${
                  msg.fromUser
                    ? 'self-end bg-blue-500 text-white'
                    : 'self-start bg-gray-200 text-black'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 3. Input Container Fixo */}
        <div className="p-6 border-t border-gray-200 flex items-center gap-4">
          <input
            type="text"
            className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            placeholder="Digite sua mensagem..."
            value={inputMessage}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputMessage(e.target.value)
            }
            onKeyDown={handleKeyPress}
          />
          <button
            className="bg-blue-500 text-white font-bold p-4 rounded-full hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSendMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.817H.75a.75.75 0 0 0-.75.75 1.5 1.5 0 0 1 1.5 1.5v2.25A.75.75 0 0 0 2.25 19.5h1.171l.406 1.83a.75.75 0 0 0 .926.94 60.542 60.542 0 0 0 16.48-6.106.75.75 0 0 0 0-1.144L5.804 2.405z" />
            </svg>
          </button>
        </div>
      </main>

      {/* 4. Painel Lateral Direito */}
      <aside className="w-64 bg-white p-6 border-l-2 border-gray-200 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Perfil</h2>
        <img
          alt="Lipson"
          className="w-24 h-24 rounded-full mb-4 border-4 border-black-400"
        />
        <h3 className="text-lg font-semibold">User</h3>
        <span className="text-sm text-gray-500">Offline</span>
      </aside>
    </div>
  );
};

export default ChatPage;