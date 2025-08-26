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

  //Sidebar constantes
  const [activeItem, setActiveItem] = useState('new-chat');

  const navItems = [
    { name: 'Novo Chat', id: 'new-chat' },
    { name: 'Histórico', id: 'history' },
    { name: 'Configurações', id: 'settings' },
  ];

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
      if (rasaResponse && rasaResponse.length > 0) { // Verificação para ver se o Rasa retornou algo
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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => { //Permissividade para o enter enviar a msg
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* 1. Painel Lateral Esquerdo */}
    <aside className="w-64 bg-gray-900 text-gray-100 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">DeepRasa</h1>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={() => setActiveItem(item.id)}
              className={`p-3 rounded-lg text-lg font-medium transition-colors duration-200 text-center ${
                activeItem === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-700'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-8 pt-4 border-t border-gray-700 text-center">
        <a href="#" className="p-3 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200">
          Version 1.0
        </a>
      </div>
    </aside>

      {/* 2. Área Central do Chat (Conteúdo Principal) */}
      <main className="flex-1 flex flex-col bg-white rounded-lg shadow-lg m-6">
        <div className="flex-1 flex flex-col overflow-y-auto p-6"> 
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl max-w-[70%] break-words ${
                  msg.fromUser ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-200 text-black'}`}
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
    </div>
  );
};

export default ChatPage;