from django.test import TestCase

# Create your tests here.
import time
import requests
import json
from django.test import TestCase

class LLMPerformanceTest(TestCase):
    """
    Script para testar o desempenho de diferentes LLMs para a tarefa de classificação.
    """

    def test_llm_performance(self):
        """
        Testa a latência e a precisão dos LLMs.
        """
        model_name ="phi3"
        test_phrases = [
            {'text': 'Fala, tudo bem?', 'expected_intent': 'saudacao'},
            {'text': 'Como posso fazer isso', 'expected_intent': 'pergunta'},
            {'text': 'Como faço um bolo de fubá', 'expected_intent': 'pergunta'},
            {'text': 'Opa, salve', 'expected_intent': 'saudacao'},
            {'text': 'to vazando', 'expected_intent': 'despedida'},
        ]
        rasa_prompts = ['saudacao', 'despedida', 'pergunta']

        print(f"Testando o modelo: {model_name}")
        for phrase_data in test_phrases:
                phrase = phrase_data['text']
                expected_intent = phrase_data['expected_intent']
                print(f"  Testando a frase: '{phrase}'")

                try:
                    start_time = time.time()
                    
                    ollama_url = "http://localhost:11434/api/generate"
                    payload = {
                        "model": model_name,
                        "prompt": f"""
                        Classifique a mensagem do usuário na intenção mais provável.

                        **Mensagem do usuário:** {phrase}
                        **Intenções:** {rasa_prompts}

                        Retorne apenas o JSON: {{ "intent": "nome_da_intencao", "confidence": "porcentagem_da_confianca" }}
                        """,
                        "stream": False,
                        "options": {"temperature": 0.01, "think": False}
                    }

                    ollama_response = requests.post(ollama_url, json=payload)
                    ollama_response.raise_for_status()

                    end_time = time.time()
                    latency = end_time - start_time

                    print(f"    Latência: {latency:.2f} segundos")

                    response_text = ollama_response.json().get('response', '')
                    
                    import re
                    json_match = re.search(r'\{.*?\}', response_text, re.DOTALL)
                    if json_match:
                        json_string = json_match.group(0)
                        llm_result = json.loads(json_string)
                        print(f"    Intenção retornada: {llm_result['intent']}")
                        print(f"    Confiança: {llm_result['confidence']}")
                        print(f"    Intenção esperada: {expected_intent}")
                    else:
                        print(f"    Não foi possível extrair um JSON da resposta.")
                    time.sleep(2)
                except requests.exceptions.RequestException as e:
                    print(f"    Erro na requisição para o Ollama: {e}")
                except json.JSONDecodeError as e:
                    print(f"    Erro ao decodificar JSON: {e}")
