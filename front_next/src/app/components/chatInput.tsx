'use client';

import { useState } from 'react';

// Aqui definimos o tipo para a propriedade onSendMessage, que é uma função que aceita uma string
type ChatInputParam = {
  onSendMessage: (message: string) => void;
};

const ChatInput: React.FC<ChatInputParam> = ({ onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage(''); // Limpa o campo de input após o envio
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t-2 border-gray-200 flex">
      <input
        type="text"
        className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Digite sua mensagem..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        className="bg-blue-500 text-white font-bold p-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSendMessage}
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;