import requests
import json

# URL da sua API Django
url = 'http://localhost:8000/api/llm_fallback/'

# Dados que você quer enviar no formato JSON
data = {
    'user_message': 'Esta é uma mensagem de teste.',
    'rasa_prompts': ['saudacao', 'despedida', 'perguntar_sobre_produto']
}

print("Enviando requisição POST para a API...")

try:
    # A biblioteca 'requests' lida com a serialização JSON e o Content-Type automaticamente
    response = requests.post(url, json=data)

    # Verifica se a requisição foi bem-sucedida (status code 200)
    if response.status_code == 200:
        print("Requisição enviada com sucesso!")
        print(f"Status Code: {response.status_code}")
        print("Resposta da API:")
        print(json.dumps(response.json(), indent=2))
    else:
        print("A requisição falhou.")
        print(f"Status Code: {response.status_code}")
        print(f"Resposta: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"Erro ao conectar com a API. Verifique se o servidor Django está rodando.")
    print(f"Erro: {e}")