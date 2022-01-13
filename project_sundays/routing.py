from django.urls import path
from project_sundays.sundays_backend.consumers import WasherConsumer, DryerConsumer

websocket_urlpatterns = [
    path('ws/washer/', WasherConsumer.as_asgi()),
    path('ws/dryer/', DryerConsumer.as_asgi()),
    
]