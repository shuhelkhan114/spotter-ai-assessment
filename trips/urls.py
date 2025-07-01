from django.urls import path
from .views import TripRouteView, TripLogsView

urlpatterns = [
    path('route/', TripRouteView.as_view()),
    path('logs/', TripLogsView.as_view()),
]
