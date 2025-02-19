import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private rasaUrl = 'http://localhost:5005/webhooks/rest/webhook'; // ajuste a URL conforme seu setup

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.rasaUrl, {
      sender: "user",
      message: message
    });
  }
}