from rest_framework import viewsets, status

from .filters import VerificationQuestionFilter, VerificationQuestionnaireFilter
from .serializers import (
    VerificationAnswersSerializer,
    VerificationQuestionnaireSerializer,
    VerificationQuestionsSerializer,
    VerificationAnswerSerializer2,
    VerificationQuestionCreateSerializer
)
from .models import VerificationQuestion, VerificationAnswers, VerificationQuestionnaire
from inventory.models import UserItem

from rest_framework.response import Response
from rest_framework.decorators import action


# Create your views here.

# class VerificationQuestionView(viewsets.ModelViewSet):
#     queryset = VerificationQuestion.objects.all()
#     serializer_class = VerificationQuestionsSerializer
#     lookup_field = 'pk'

class VerificationQuestionView(viewsets.ModelViewSet):
    queryset = VerificationQuestion.objects.all()
    serializer_class = VerificationQuestionsSerializer
    lookup_field = 'pk'

    def create(self, request, *args, **kwargs):
        print("🔹 Incoming request:", request.data)

        input_serializer = VerificationQuestionCreateSerializer(data=request.data)
        if not input_serializer.is_valid():
            print("❌ Validation failed:", input_serializer.errors)
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = input_serializer.validated_data
        serial_id = data['found_item_serial_id']
        question_texts = data['questions']

        try:
            found_item = UserItem.objects.get(serial_id=serial_id)
        except UserItem.DoesNotExist:
            return Response(
                {"error": "Item with this serial_id does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            questionnaire = found_item.questionnaire
        except VerificationQuestionnaire.DoesNotExist:
            return Response(
                {"error": "Questionnaire for this item does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create and attach questions
        created_questions = [
            VerificationQuestion(questionnaire=questionnaire, question_text=text)
            for text in question_texts
        ]
        VerificationQuestion.objects.bulk_create(created_questions)

        return Response(
            {"message": f"{len(created_questions)} questions added."},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=["put"], url_path="bulk-update")
    def bulk_update_questions(self, request):
        print("🔄 PUT request received:", request.data)

        input_serializer = VerificationQuestionCreateSerializer(data=request.data)
        if not input_serializer.is_valid():
            print("❌ Validation failed:", input_serializer.errors)
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = input_serializer.validated_data
        serial_id = data['found_item_serial_id']
        new_question_texts = data['questions']

        try:
            found_item = UserItem.objects.get(serial_id=serial_id)
        except UserItem.DoesNotExist:
            return Response(
                {"error": "Item with this serial_id does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            questionnaire = found_item.questionnaire
        except VerificationQuestionnaire.DoesNotExist:
            return Response(
                {"error": "Questionnaire for this item does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ❌ Delete all existing questions
        questionnaire.questions.all().delete()

        # ✅ Add the new ones
        new_questions = [
            VerificationQuestion(questionnaire=questionnaire, question_text=text)
            for text in new_question_texts
        ]
        VerificationQuestion.objects.bulk_create(new_questions)

        return Response(
            {"message": f"Replaced with {len(new_questions)} question(s)."},
            status=status.HTTP_200_OK
        )

class VerificationAnswersView(viewsets.ModelViewSet):
    queryset = VerificationAnswers.objects.all()
    serializer_class = VerificationAnswerSerializer2
    lookup_field = 'pk'
    filterset_class = VerificationQuestionFilter

# class VerificationQuestionnaireView(viewsets.ModelViewSet):
#     queryset = VerificationQuestionnaire.objects.all()
#     serializer_class = VerificationQuestionnaireSerializer
#     lookup_field = 'pk'
#     filterset_class= VerificationQuestionnaireFilter

class VerificationQuestionnaireView(viewsets.ModelViewSet):
    queryset = VerificationQuestionnaire.objects.all()
    serializer_class = VerificationQuestionnaireSerializer
    lookup_field = 'pk'
    filterset_class = VerificationQuestionnaireFilter


# class LostItemQnAView(APIView):
#     def get(self, request, serial_id):
#         print(f"Received request for lost item with serial_id: {serial_id}")
        
#         try:
#             lost_item = UserItem.objects.get(serial_id=serial_id)
#             print(f"Found lost item: {lost_item}")
#         except UserItem.DoesNotExist:
#             print("Lost item not found.")
#             return Response({"error": "Lost item not found."}, status=404)

#         try:
#             questionnaire = VerificationQuestionnaire.objects.get(found_item=lost_item)
#             print(f"Found questionnaire: {questionnaire}")
#         except VerificationQuestionnaire.DoesNotExist:
#             print("No questionnaire found for this item.")
#             return Response({"error": "No questionnaire found for this item."}, status=404)

#         qna_data = []
#         answers = questionnaire.answers.select_related('question')
#         print(f"Found {answers.count()} answers for the questionnaire.")

#         for answer in answers:
#             print(f"Processing answer: question='{answer.question.text}', answer='{answer.answer}'")
#             qna_data.append({
#                 "question": answer.question.text,
#                 "answer": answer.answer
#             })

#         response_data = {
#             "lost_item": lost_item.serial_id,
#             "questions_and_answers": qna_data
#         }

#         print(f"Returning response: {response_data}")
#         return Response(response_data)
