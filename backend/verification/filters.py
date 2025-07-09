import django_filters
from .models import VerificationAnswers, VerificationQuestionnaire

class VerificationQuestionFilter(django_filters.FilterSet):
    class Meta:
        model = VerificationAnswers
        fields = ['lost_item']

class VerificationQuestionnaireFilter(django_filters.FilterSet):
    class Meta:
        model = VerificationQuestionnaire
        fields = ['found_item']