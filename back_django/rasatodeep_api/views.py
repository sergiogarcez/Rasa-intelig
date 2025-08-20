from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LLMFallbackView(APIView):
    
    def post(self, request):
        user_message = request.data.get('user_message')
        rasa_prompts = request.data.get('rasa_prompts')

        # Para teste inicial, vamos apenas verificar se os dados foram recebidos.
        print(f"Mensagem do usuário: {user_message}")
        print(f"Prompts do Rasa: {rasa_prompts}")

        # Retorne uma resposta de sucesso.
        response_data = {
            "status": "success",
            "message": "Dados recebidos com sucesso. A lógica do LLM virá aqui."
        }
        return Response(response_data, status=status.HTTP_200_OK)