from rest_framework import serializers
from .models import VerificationAnswers, VerificationQuestion, VerificationQuestionnaire
from inventory.models import UserItem
from inventory.serializers import UserItemSerializer



# class VerificationQuestionsSerializer(serializers.ModelSerializer):
#     class Meta :
#         model = VerificationQuestion
#         fields = '__all__'

class VerificationQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'question_text', 'is_required']

# class VerificationQuestionnaireSerializer(serializers.ModelSerializer):
#     questions = VerificationQuestionsSerializer()
#     class Meta :
#         model = VerificationQuestionnaire
#         fields = ['found_item', 'created_at', 'questions']

class VerificationQuestionnaireSerializer(serializers.ModelSerializer):
    questions = VerificationQuestionsSerializer(many=True, read_only=True)  # Related name

    class Meta:
        model = VerificationQuestionnaire
        fields = ['id', 'found_item', 'created_at', 'questions']

class VerificationAnswersSerializer(serializers.ModelSerializer):
    class Meta :
        model = VerificationAnswers
        fields = '__all__'



class VerificationAnswerSerializer2(serializers.ModelSerializer):
    question = VerificationQuestionsSerializer()
    class Meta:
        model = VerificationAnswers
        fields = ['id', 'answer_text', 'created_at', 'question', 'lost_item']


class VerificationAnswerListSerializer(serializers.Serializer):
    found_item_serial_id = serializers.CharField(source="questionnaire.found_item.serial_id", read_only=True)
    questions_and_answers = serializers.SerializerMethodField()

    def get_questions_and_answers(self, obj):
        lost_item = self.context.get("lost_item")
        if not lost_item:
            return []

        answers = VerificationAnswers.objects.filter(
            question__questionnaire=obj,
            lost_item=lost_item
        ).select_related('question')

        return VerificationAnswerSerializer2(answers, many=True).data


# class VerificationQuestionCreateSerializer(serializers.Serializer):
#     found_item_serial_id = serializers.CharField()
#     questions = serializers.ListField(
#         child=serializers.CharField(), allow_empty=False
#     )

#     def create(self, validated_data):
#         serial_id = validated_data['found_item_serial_id']
#         question_texts = validated_data['questions']

#         try:
#             found_item = UserItem.objects.get(serial_id=serial_id)
#         except UserItem.DoesNotExist:
#             raise serializers.ValidationError("Item with that serial_id does not exist.")

#         # Create the questionnaire
#         questionnaire = VerificationQuestionnaire.objects.create(found_item=found_item)

#         # Create the questions
#         VerificationQuestion.objects.bulk_create([
#             VerificationQuestion(questionnaire=questionnaire, question_text=qt)
#             for qt in question_texts
#         ])

#         return questionnaire
    



# class VerificationQuestionCreateSerializer(serializers.Serializer):
#     found_item_serial_id = serializers.CharField()
#     questions = serializers.ListField(
#         child=serializers.CharField(), allow_empty=False
#     )


class VerificationQuestionCreateSerializer(serializers.Serializer):
    found_item_serial_id = serializers.CharField()
    questions = serializers.ListField(
        child=serializers.CharField(), allow_empty=False
    )
