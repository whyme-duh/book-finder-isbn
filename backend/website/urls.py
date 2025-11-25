from django.urls import path
from . import views

urlpatterns = [
    # Route: /api/lookup/9780140328721
    path('api/lookup/<str:isbn>/', views.book_lookup, name='book_lookup'),
]