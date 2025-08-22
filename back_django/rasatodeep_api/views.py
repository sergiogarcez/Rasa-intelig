from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import json

class LLMFallbackView(APIView):
    
    def post(self, request):
        user_message = request.data.get('user_message')
        rasa_prompts = request.data.get('rasa_prompts')

        # 1. Constrói o prompt para o DeepSeek
        # Instrua o LLM a atuar como um classificador e a retornar um JSON
        prompt = f"""
        Você é um classificador de intenções. Sua tarefa é analisar a mensagem do usuário e
        determinar qual das intenções a seguir é a mais adequada.
        
        **Instruções:**
        - Retorne apenas a intenção mais provável com uma porcentagem de confiança.
        - O formato de saída deve ser um objeto JSON.
        
        **Mensagem do usuário:** "{user_message}"
        
        **Lista de intenções (prompts):**
        {rasa_prompts}

        **Formato de saída JSON (apenas o JSON):**
        {{ "intent": "nome_da_intenção", "confidence": porcentagem_da_confiança }}
        """

        # 2. Faz a requisição para o servidor Ollama
        try:
            ollama_url = "http://localhost:11434/api/generate"
            payload = {
                "model": "deepseek-coder",  # Nome do modelo do Ollama
                "prompt": prompt,
                "stream": False,  # Desativa o streaming para obter a resposta completa
                "options": {
                    "temperature": 0.1 # Garante uma resposta mais determinística
                }
            }
            
            ollama_response = requests.post(ollama_url, json=payload)
            ollama_response.raise_for_status() # Lança um erro se a resposta não for 200
            
            response_text = ollama_response.json()["response"]
            
            # Limpa o texto da resposta para garantir que é um JSON válido
            llm_result = json.loads(response_text.strip().lstrip('`json').rstrip('`'))

            return Response(llm_result, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Erro de comunicação com Ollama: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except json.JSONDecodeError:
            return Response({"error": "Resposta do Ollama não é um JSON válido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class LLMFallbackView(APIView):
    
#     def post(self, request):
#         user_message = request.data.get('user_message')
#         rasa_prompts = request.data.get('rasa_prompts')

#         # Para teste inicial, vamos apenas verificar se os dados foram recebidos.
#         print(f"Mensagem do usuário: {user_message}")
#         print(f"Prompts do Rasa: {rasa_prompts}")

#         # Retorne uma resposta de sucesso.
#         response_data = {
#             "status": "success",
#             "message": "Dados recebidos com sucesso. A lógica do LLM virá aqui."
#         }
#         return Response(response_data, status=status.HTTP_200_OK)