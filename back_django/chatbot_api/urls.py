"""
URL configuration for chatbot_api project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('rasatodeep_api.urls')),  # Adicione esta linha
]