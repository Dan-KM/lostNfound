from rest_framework import serializers
from .models import VerificationAnswers, VerificationQuestion, VerificationQuestionnaire
from inventory.models import UserItem
from inventory.serializers import UserItemSerializer, ItemSerializer


# class VerificationQuestionsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = VerificationQuestion
#         fields = ['id', 'question_text', 'is_required']

class simpleVerificationQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'questionnaire', 'question_text', 'is_required']


class VerificationAnswerSerializer(serializers.ModelSerializer):
    # question = VerificationQuestionsSerializer()
    # lost_item = UserItemSerializer(read_only = True)
    class Meta:
        model = VerificationAnswers
        fields = ['id', 'status','answer_text', 'created_at', 'question', 'lost_item']

class VerificationAnswerWithQuestionSerializer(serializers.ModelSerializer):
    question = simpleVerificationQuestionsSerializer()
    # lost_item = UserItemSerializer(read_only = True)
    class Meta:
        model = VerificationAnswers
        fields = ['id', 'status','answer_text', 'created_at', 'question', 'lost_item']


class VerificationQuestionsSerializer(serializers.ModelSerializer):
    answers = VerificationAnswerSerializer(many=True, read_only=True)
    class Meta:
        model = VerificationQuestion
        fields = ['id', 'question_text', 'is_required', 'answers']



class VerificationQuestionnaireSerializer(serializers.ModelSerializer):
    questions = VerificationQuestionsSerializer(many=True, read_only=True)  # Related name

    class Meta:
        model = VerificationQuestionnaire
        fields = ['id', 'found_item', 'created_at', 'questions']


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



#=========================== some new stuff ===========================

# class LostItemWithQuestionsSerializer(serializers.ModelSerializer):
#     questions = serializers.SerializerMethodField()
#     item = ItemSerializer()
#     answers = serializers.SerializerMethodField()
#     class Meta:
#         model = UserItem
#         fields = ['id', 'serial_id', 'item', 'questions', 'answers']

#     def get_questions(self, obj):
#         questions = []

#         for match in obj.lost_item_matches.all():
#             found_item = match.found_item
#             questionnaire = getattr(found_item, 'questionnaire', None)
#             if questionnaire:
#                 qs = questionnaire.questions.all()
#                 questions.extend(VerificationQuestionSerializer(qs, many=True).data)

#         return questions
    
#     def get_answers(self, obj):
#         answers = []
#         for match in obj.lost_item_matches.all():
#             lost_item = match.lost_item
#             answer = getattr(lost_item, 'lost_item_answers', None)
#             if answer:
#                 answers.extend(VerificationQuestionSerializer(answer, many=True).data)

#         return answers


class LostItemWithQuestionsSerializer(serializers.ModelSerializer):
    item = ItemSerializer()
    questions = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = UserItem
        fields = ['id', 'serial_id', 'item', 'questions', 'answers']

    def get_questions(self, obj):
        questions = []
        for match in obj.lost_item_matches.all():
            questionnaire = getattr(match.found_item, 'questionnaire', None)
            if questionnaire:
                qs = questionnaire.questions.all()
                questions.extend(VerificationQuestionSerializer(qs, many=True).data)
        return questions

    def get_answers(self, obj):
        answers_qs = obj.lost_item_answers.all()
        return VerificationAnswerSerializer(answers_qs, many=True).data









