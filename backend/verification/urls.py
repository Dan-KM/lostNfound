from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('question', views.VerificationQuestionView)
router.register('answer', views.VerificationAnswerView)
router.register('questionnaire', views.FoundItemQuestionnaireViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
