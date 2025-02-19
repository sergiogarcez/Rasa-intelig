import { Component } from '@angular/core';
import { ChatService } from '../services/chat-service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
    selector: 'app-chat',
    standalone: true,
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})

export class ChatComponent {
    messages: Message[] = [];
    userMessage: string = '';
  
    constructor(private chatService: ChatService) {}
  
    sendMessage() {
      if (this.userMessage.trim()) {
        // Adiciona mensagem do usuário
        this.messages.push({
          text: this.userMessage,
          isUser: true,
          timestamp: new Date()
        });
  
        // Envia para o Rasa
        this.chatService.sendMessage(this.userMessage)
          .subscribe({
            next: (responses) => {
              // Adiciona cada resposta do bot
              responses.forEach((response: any) => {
                this.messages.push({
                  text: response.text,
                  isUser: false,
                  timestamp: new Date()
                });
              });
            },
            error: (error) => {
              console.error('Erro ao enviar mensagem:', error);
              this.messages.push({
                text: 'Desculpe, tive um problema ao processar sua mensagem.',
                isUser: false,
                timestamp: new Date()
              });
            }
          });
  
        this.userMessage = ''; // Limpa o input
      }
    }
  }