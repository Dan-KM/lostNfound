from rest_framework import serializers
from .models import VerificationAnswers, VerificationQuestion, VerificationQuestionnaire
from inventory.models import UserItem
from inventory.serializers import UserItemSerializer


class VerificationQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'question_text', 'is_required']


class VerificationQuestionnaireSerializer(serializers.ModelSerializer):
    questions = VerificationQuestionsSerializer(many=True, read_only=True)  # Related name

    class Meta:
        model = VerificationQuestionnaire
        fields = ['id', 'found_item', 'created_at', 'questions']


class VerificationAnswerSerializer(serializers.ModelSerializer):
    # question = VerificationQuestionsSerializer()
    # lost_item = UserItemSerializer(read_only = True)
    class Meta:
        model = VerificationAnswers
        fields = ['id', 'status','answer_text', 'created_at', 'question', 'lost_item']


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

        return VerificationAnswerSerializer(answers, many=True).data

class VerificationQuestionCreateSerializer(serializers.Serializer):
    found_item_serial_id = serializers.CharField()
    questions = serializers.ListField(
        child=serializers.CharField(), allow_empty=False
    )


class VerificationQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'questionnaire', 'question_text', 'is_required']

    def create(self, validated_data):
        # DRF will call this if it's a single object
        return VerificationQuestion.objects.create(**validated_data)


# class BulkVerificationQuestionSerializer(serializers.ListSerializer):
#     def create(self, validated_data):
#         questions = [VerificationQuestion(**item) for item in validated_data]
#         return VerificationQuestion.objects.bulk_create(questions)


class BulkVerificationQuestionSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # Create a mapping of id -> instance
        instance_mapping = {item.id: item for item in instance}
        data_mapping = {item['id']: item for item in validated_data}

        updated_instances = []

        for question_id, data in data_mapping.items():
            obj = instance_mapping.get(question_id)
            if obj:
                for attr, value in data.items():
                    setattr(obj, attr, value)
                obj.save()
                updated_instances.append(obj)

        return updated_instances

    def create(self, validated_data):
        return VerificationQuestion.objects.bulk_create(
            [VerificationQuestion(**item) for item in validated_data]
        )


class VerificationQuestionBulkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'questionnaire', 'question_text', 'is_required']
        list_serializer_class = BulkVerificationQuestionSerializer
