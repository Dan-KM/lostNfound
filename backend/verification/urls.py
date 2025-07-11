from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('question', views.VerificationQuestionViewSet)
router.register('answer', views.VerificationAnswersView)
router.register('questionnaire', views.VerificationQuestionnaireView)
# router.register('claimant', views.ClaimantLostItemsViewSet, basename='claimant-lost-items')

urlpatterns = [
    path('', include(router.urls)),
    path('claimant/', views.ClaimantLostItemsWithQuestionsView.as_view())
]
