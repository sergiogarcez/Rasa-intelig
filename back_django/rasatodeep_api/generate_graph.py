import matplotlib.pyplot as plt
import numpy as np

def create_bar_chart(data, title, y_label, filename):
    """Cria um gráfico de barras a partir dos dados fornecidos."""
    models = list(data.keys())
    values = list(data.values())

    fig, ax = plt.subplots(figsize=(6, 4))
    bars = ax.bar(models, values, color=["#7bb410", "#bd7b18", "#1625a8"])

    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.set_xlabel('Modelos de LLM testados', fontsize=10, fontweight='bold')
    ax.set_ylabel(y_label, fontsize=12)
    ax.set_ylim(0, max(values) * 1.2)
    ax.grid(axis='y', linestyle='--', alpha=0.7)

    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')

    plt.tight_layout()
    plt.savefig(filename, dpi=900)
    print(f"Gráfico '{filename}' gerado com sucesso!")
    plt.show()

if __name__ == "__main__":
    # Dados de exemplo. Substitua por seus resultados
    # Calcule a média da latência e da confiança para cada modelo
    latency_data = {
        'phi3': 10.13, # latência em segundos
        'qwen3:4b': 135.20,
        'deepseek-r1:1.5b': 12.96,
    }

    confidence_data = {
        'phi-3:3.8b': 1.00,
        'qwen3:4b': 0.80,
        'deepseek-r1:1.5b': 0.80,
    }

    # Gera o gráfico de latência
    create_bar_chart(
        latency_data,
        'Latência Média por LLM',
        'Tempo (segundos)',
        'latency_chart.png'
    )

    # Gera o gráfico de confiança
    create_bar_chart(
        confidence_data,
        'Acurácia Média por LLM',
        'Acurácia (0.00 - 1.00)',
        'accuracy_chart.png'
    )

# def create_bar_chart(data, title, y_label, filename):
#     """Cria um gráfico de barras a partir dos dados fornecidos."""
#     models = list(data.keys())
#     values = list(data.values())

#     fig, ax = plt.subplots(figsize=(10, 6))
#     bars = ax.bar(models, values, color=['#4a148c', '#5e35b1', '#9575cd'])

#     ax.set_title(title, fontsize=16)
#     ax.set_xlabel('Modelos de LLM', fontsize=12)
#     ax.set_ylabel(y_label, fontsize=12)
#     ax.set_ylim(0, max(values) * 1.2)
#     ax.grid(axis='y', linestyle='--', alpha=0.7)

#     for bar in bars:
#         height = bar.get_height()
#         ax.annotate(f'{height:.2f}',
#                     xy=(bar.get_x() + bar.get_width() / 2, height),
#                     xytext=(0, 3),  # 3 points vertical offset
#                     textcoords="offset points",
#                     ha='center', va='bottom')

#     plt.tight_layout()
#     plt.savefig(filename, dpi=300)
#     print(f"Gráfico '{filename}' gerado com sucesso!")
#     plt.show()

# if __name__ == "__main__":
#     # Dados de exemplo. Substitua por seus resultados
#     # Calcule a média da latência e da confiança para cada modelo
#     latency_data = {
#         'phi3': 2.35, # latência em segundos
#         'qwen3:4b': 3.12,
#         'deepseek-r1:1.5b': 1.88,
#     }

#     confidence_data = {
#         'phi3': 0.85,
#         'qwen3:4b': 0.89,
#         'deepseek-r1:1.5b': 0.75,
#     }

#     # Gera o gráfico de latência
#     create_bar_chart(
#         latency_data,
#         'Latência Média por LLM',
#         'Tempo (segundos)',
#         'latency_chart.png'
#     )

#     # Gera o gráfico de confiança
#     create_bar_chart(
#         confidence_data,
#         'Confiança Média por LLM',
#         'Confiança (0.00 - 1.00)',
#         'confidence_chart.png'
#     )




