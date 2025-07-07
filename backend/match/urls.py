from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LostFoundMatchView

matchRouter = DefaultRouter()
matchRouter.register('', LostFoundMatchView)

urlpatterns=[
    path('', include(matchRouter.urls)),
]