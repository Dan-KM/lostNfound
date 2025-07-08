from rest_framework import serializers
from .models import VerificationAnswer, VerificationQuestion, VerificationQuestionnaire
from inventory.models import UserItem
from inventory.serializers import UserItemSerializer

class VerificationQuestionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = '__all__'

class VerificationAnswerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationAnswer
        fields = '__all__'


class VerificationAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationAnswer
        fields = ['id', 'question', 'answer_text', 'created_at']

class VerificationQuestionSerializer(serializers.ModelSerializer):
    answer = serializers.SerializerMethodField()

    class Meta:
        model = VerificationQuestion
        fields = ['id', 'text', 'is_required', 'answer']

    def get_answer(self, obj):
        user = self.context.get('user')
        if not user or user.is_anonymous:
            return None
        answer = obj.verificationanswer_set.filter(claimant=user).first()
        if answer:
            return VerificationAnswerSerializer(answer).data
        return None

class VerificationQuestionnaireSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    found_item = UserItemSerializer()
    class Meta:
        model = VerificationQuestionnaire
        fields = ['id', 'found_item', 'created_at', 'questions']

    def get_questions(self, obj):
        questions = obj.questions
        return VerificationQuestionSerializer(questions, many=True, context=self.context).data

class FoundItemWithQuestionnaireSerializer(serializers.ModelSerializer):
    questionnaire = serializers.SerializerMethodField()

    class Meta:
        model = UserItem
        fields = ['id', 'serial_id', 'questionnaire']

    def get_questionnaire(self, obj):
        questionnaire = getattr(obj, 'questionnaire', None)
        if not questionnaire:
            return None
        return VerificationQuestionnaireSerializer(questionnaire, context=self.context).data
