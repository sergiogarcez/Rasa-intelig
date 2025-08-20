from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('llm_fallback/', views.LLMFallbackView.as_view(), name= "llm_fallback")
]