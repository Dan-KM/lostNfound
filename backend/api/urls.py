from django.urls import path, include
# from rest_framework.routers import DefaultRouter


urlpatterns = [    
    path('auth/', include('accounts.urls')),
    path('inventory/', include('inventory.urls')),
    path('match/', include('match.urls')),
    path('verify/', include('verification.urls')),
    path('notifications/', include('notification.urls')),
]