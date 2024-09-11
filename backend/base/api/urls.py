from . import views
from django.urls import path
from .views import MyTokenObtainView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("", views.get_routes),
    path('token/', MyTokenObtainView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
