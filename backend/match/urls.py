from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import LostFoundMatchView, FoundItemMatchViewSet

matchRouter = DefaultRouter()
matchRouter.register('', LostFoundMatchView)

router = DefaultRouter()
router.register('for', FoundItemMatchViewSet, basename='found-item-match')

urlpatterns=[
    path('', include(matchRouter.urls)),
    path('', include(router.urls)),
]