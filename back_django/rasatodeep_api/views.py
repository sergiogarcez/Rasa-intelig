from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
logger = logging.getLogger(__name__)
import requests
from ollama import generate
import json
import re

class LLMFallbackView(APIView):
    
    def remove_thinking_tags(self, text):
        # Remove tudo entre <think> e </think>
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        # Remove outras variações
        text = re.sub(r'<thinking>.*?</thinking>', '', text, flags=re.DOTALL)
        text = re.sub(r'\*thinks.*?\*', '', text, flags=re.DOTALL)
        return text.strip()

    def post(self, request):
        try:
            user_message = request.data.get('user_message')
            rasa_prompts = request.data.get('rasa_prompts')

            prompt = f"""
            Classifique a mensagem do usuário na intenção mais provável.

            **Mensagem do usuário:** {user_message}
            **Intenções:** {rasa_prompts}

            Retorne apenas o JSON: {{ "intent": "nome_da_intenção", "confidence": "porcentagem_da_confiança" }}
            """

            #Template para enviar ao Ollama via lib, retirei o endpoint
            ollama_response = generate(
                model="phi3", # Nome do modelo do Ollama
                prompt=prompt,
                stream=False, # Desativa o streaming para obter a resposta completa
                options=  { "temperature": 0.01 }# Garante uma resposta mais determinística
                )
                # "model": "qwen3:4b",  # Nome do modelo do Ollama
                # "options": {
                #     "temperature": 0.01 # Garante uma resposta mais determinística
                # },
            
            
            response_text = ollama_response["response"]
            
            #Metodo para tentar filtrar somente o json
            # json_begin = response_text.find('{')
            # json_end = response_text.rfind('}') + 1
            # if json_begin != -1 and json_end != 0:
            #     json_string = response_text[json_begin:json_end]
            #     llm_result = json.loads(json_string)
            # else:
            #     raise json.JSONDecodeError("JSON não encontrado na resposta.", response_text, 0)
            clean_llm_result = self.remove_thinking_tags(response_text)
            json_match = re.search(r'\{.*?\}', clean_llm_result, re.DOTALL) #Logica de regex para extrair somente o json
            if json_match:
                json_string = json_match.group(0) #O que consegue puxar o que cai no regex
                llm_result = json.loads(json_string)
            else:
                raise json.JSONDecodeError("JSON não encontrado na resposta.", response_text, 0)
            return Response(llm_result, status=status.HTTP_200_OK) #Retorna para o Rasa o Json com a resposta

        except requests.exceptions.RequestException as e: #Erro na request.
            logger.error(f"Erro de comunicação com Ollama: {e}", exc_info=True)
            return Response({"error": f"Erro de comunicação com Ollama: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except json.JSONDecodeError as j: #Erro atrelado ao json transmitido
            # Captura erros se a resposta do Ollama não for um JSON válido
            logger.error(f"Resposta do Ollama não é um JSON válido: {j}. Resposta bruta: {response_text}", exc_info=True)
            return Response({"error": "Resposta do Ollama não é um JSON válido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e: #Qualquer outro erro.
            logger.error(f"Erro inesperado: {e}")
            return Response({"error": f"Erro inesperado: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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