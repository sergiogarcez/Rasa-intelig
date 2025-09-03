from typing import Any, Text, Dict, List, Union
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
# from rasa_chatbot.data.nlu import *

import requests 

def normalize_confidence(confidence: Union[str, float]) -> float: #Versão um pouco antiga do python. 
    """ Recorta a possivel porcentagem caso venha e se for um numero inteiro,
        transforma em decimal via divisão por 100.
    """
    if isinstance(confidence, str):
        confidence = confidence.replace('%', '').strip()
        try:
            val = float(confidence)
            if val > 1:
                return val / 100.0
            return val
        except ValueError:
            return 0.0
    return float(confidence)


class ActionFallbackLlm(Action):

    def name(self) -> str:
        return "action_fallback_llm"

    def run(self, dispatcher: CollectingDispatcher, #Padrão do Rasa
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        django_endpoint = "http://localhost:8000/api/llm_fallback/"
        user_message = tracker.latest_message.get("text")
        # Em um projeto real, você teria que obter essa lista dinamicamente do seu domínio.
        rasa_prompts = ["saudacao", "despedida"]

        try:
            # Envia a requisição POST para a sua API Django
            response = requests.post(django_endpoint, json={
                "user_message": user_message,
                "rasa_prompts": rasa_prompts
            })

            # Verifica se a resposta foi bem-sucedida
            if response.status_code == 200:
                django_response = response.json()
                
                if 'intent' in django_response and 'confidence' in django_response: #Após o django pegar a resposta com o LLM
                    llm_intent = django_response['intent'] #Intenção e confiança 
                    llm_confidence = django_response['confidence']
                    normal_confidence = normalize_confidence(llm_confidence)

                    if (normal_confidence < 0.90): #Verificação caso a confiança seja baixa.
                        dispatcher.utter_message(text="Perdoe-me, não entendi.")
                    else:
                        if llm_intent in domain.get("intents", []): #Verifica se a intenção existe conforme o nlu.yml
                            if llm_intent == "saudacao":
                                dispatcher.utter_message(text="Olá!, seja la qual for a saudação ou não. Como posso ajudar você?")
                            elif llm_intent == "despedida":
                                dispatcher.utter_message(text="Creio que voce quis se despedir. Tchau! Foi um prazer conversar com você.")
                            else:
                                dispatcher.utter_message(text=f"Entendi que a intenção é {llm_intent}, com {llm_confidence} de confiança. Em breve farei algo com essa informação.")
                        else:
                            dispatcher.utter_message(text="Desculpe, a sua mensagem nao fez nenhum sentido para mim")
            else:
                dispatcher.utter_message(text=f"A API do Django retornou um erro: {response.status_code}")

        except requests.exceptions.RequestException as e:
            dispatcher.utter_message(text="Desculpe, não consigo me comunicar com o assistente inteligente (Deepseek).")
            print(f"Erro na requisição para a API do Django: {e}")

        return []