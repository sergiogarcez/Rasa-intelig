from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

import requests 

class ActionFallbackLlm(Action):

    def name(self) -> str:
        return "action_fallback_llm"

    def run(self, dispatcher: CollectingDispatcher, #Padrão do Rasa
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        user_message = tracker.latest_message.get("text")
        # Em um projeto real, você teria que obter essa lista dinamicamente do seu domínio.
        rasa_prompts = ["saudacao", "despedida"]

        try:
            # Envia a requisição POST para a sua API Django
            response = requests.post("http://localhost:8000/api/llm_fallback/", json={
                "user_message": user_message,
                "rasa_prompts": rasa_prompts
            })

            # Verifica se a resposta foi bem-sucedida
            if response.status_code == 200:
                django_response = response.json()
                # A sua lógica do LLM no Django virá aqui para
                # processar essa resposta e tomar uma decisão.
                
                # Por enquanto, apenas repasse a mensagem de sucesso
                # que a sua API Django está retornando.
                dispatcher.utter_message(text=django_response.get("message"))
            else:
                dispatcher.utter_message(text=f"A API do Django retornou um erro: {response.status_code}")

        except requests.exceptions.RequestException as e:
            dispatcher.utter_message(text="Desculpe, não consigo me comunicar com o assistente inteligente (Deepseek).")
            print(f"Erro na requisição para a API do Django: {e}")

        return []