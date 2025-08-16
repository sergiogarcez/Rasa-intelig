'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useState } from 'react';


// Interface para as mensagens, definir o texto e se veio do usuario ou nao;
interface Message {
  text: string;
  fromUser: boolean;
}
// Aqui você vai importar o ícone do chatbot.
// Se você não tiver, pode usar um SVG ou um texto simples.
const ChatbotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M4.912 2.298a1.53 1.53 0 0 1 2.213-.882l.98 1.47.954-.318a1.53 1.53 0 0 1 2.213-.882l.98 1.47.954-.318a1.53 1.53 0 0 1 2.213-.882l.98 1.47c.725.725.725 1.902 0 2.626l-2.071 2.072a1.523 1.523 0 0 1-2.205-.07L7.81 7.747a1.53 1.53 0 0 1-.077-2.204L8.067 5.23a1.53 1.53 0 0 1 .882-2.213l.318-.954zM12 17.25c4.142 0 7.5-2.686 7.5-6s-3.358-6-7.5-6-7.5 2.686-7.5 6 3.358 6 7.5 6z" />
    <path d="M12 21a9 9 0 0 0 7.37-3.666c-.655-.45-1.427-.694-2.25-.694-1.922 0-3.694.755-5.021 2.083a4.512 4.512 0 0 1-6.42-6.42C5.556 12.306 4.305 15 2.822 15a9 9 0 0 0 9.178 6z" />
  </svg>
);

const Chat = () => {
  const [messages, setMessages] = useState<Message[]> ([]); //Chama a interface Mensagem para definir como default.

  // A lógica de envio de mensagens para o Rasa virá aqui.

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-full shadow-lg">
          <ChatbotIcon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 z-40" />
        <Dialog.Content className="fixed bottom-20 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <Dialog.Title className="text-xl font-bold p-4 border-b">
            Meu Assistente
          </Dialog.Title>
          <ScrollArea.Root className="flex-grow p-4">
            <ScrollArea.Viewport className="h-full">
              {/* Aqui você vai renderizar as mensagens do chat */}
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.text}
                </div>
              ))}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="w-2" orientation="vertical">
              <ScrollArea.Thumb className="bg-gray-400 rounded" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
          <div className="p-4 border-t flex">
            {/* Aqui você vai ter o input e o botão para enviar a mensagem */}
            <input type="text" className="flex-grow p-2 border rounded-l" placeholder="Digite sua mensagem..." />
            <button className="bg-blue-500 text-white font-bold p-2 rounded-r">
              Enviar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Chat;