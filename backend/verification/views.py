from rest_framework import viewsets, status

from .filters import VerificationQuestionFilter, VerificationQuestionnaireFilter
from .serializers import (
    VerificationQuestionnaireSerializer,
    VerificationQuestionsSerializer,
    VerificationAnswerSerializer,
    VerificationQuestionCreateSerializer,
    VerificationQuestionBulkSerializer
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

#     def create(self, request, *args, **kwargs):
#         print("🔹 Incoming request:", request.data)

#         input_serializer = VerificationQuestionCreateSerializer(data=request.data)
#         if not input_serializer.is_valid():
#             print("❌ Validation failed:", input_serializer.errors)
#             return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         data = input_serializer.validated_data
#         serial_id = data['found_item_serial_id']
#         question_texts = data['questions']

#         try:
#             found_item = UserItem.objects.get(serial_id=serial_id)
#         except UserItem.DoesNotExist:
#             return Response(
#                 {"error": "Item with this serial_id does not exist."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             questionnaire = found_item.questionnaire
#         except VerificationQuestionnaire.DoesNotExist:
#             return Response(
#                 {"error": "Questionnaire for this item does not exist."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Create and attach questions
#         created_questions = [
#             VerificationQuestion(questionnaire=questionnaire, question_text=text)
#             for text in question_texts
#         ]
#         VerificationQuestion.objects.bulk_create(created_questions)

#         return Response(
#             {"message": f"{len(created_questions)} questions added."},
#             status=status.HTTP_201_CREATED
#         )
    
#     @action(detail=False, methods=["put"], url_path="bulk-update")
#     def bulk_update_questions(self, request):
#         print("🔄 PUT request received:", request.data)

#         input_serializer = VerificationQuestionCreateSerializer(data=request.data)
#         if not input_serializer.is_valid():
#             print("❌ Validation failed:", input_serializer.errors)
#             return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         data = input_serializer.validated_data
#         serial_id = data['found_item_serial_id']
#         new_question_texts = data['questions']

#         try:
#             found_item = UserItem.objects.get(serial_id=serial_id)
#         except UserItem.DoesNotExist:
#             return Response(
#                 {"error": "Item with this serial_id does not exist."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             questionnaire = found_item.questionnaire
#         except VerificationQuestionnaire.DoesNotExist:
#             return Response(
#                 {"error": "Questionnaire for this item does not exist."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # ❌ Delete all existing questions
#         questionnaire.questions.all().delete()

#         # ✅ Add the new ones
#         new_questions = [
#             VerificationQuestion(questionnaire=questionnaire, question_text=text)
#             for text in new_question_texts
#         ]
#         VerificationQuestion.objects.bulk_create(new_questions)

#         return Response(
#             {"message": f"Replaced with {len(new_questions)} question(s)."},
#             status=status.HTTP_200_OK
#         )



class VerificationQuestionViewSet(viewsets.ModelViewSet):
    queryset = VerificationQuestion.objects.all()
    serializer_class = VerificationQuestionBulkSerializer

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)
    
    def update(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        if not is_many:
            return super().update(request, *args, **kwargs)

        # Split data
        update_data = [item for item in request.data if 'id' in item]
        create_data = [item for item in request.data if 'id' not in item]

        response_data = []

        # Handle updates
        if update_data:
            ids = [item['id'] for item in update_data]
            existing_instances = VerificationQuestion.objects.filter(id__in=ids)

            serializer = self.get_serializer(existing_instances, data=update_data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_data.extend(serializer.data)

        # Handle creations
        if create_data:
            serializer = self.get_serializer(data=create_data, many=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response_data.extend(serializer.data)

        return Response(response_data, status=status.HTTP_200_OK)


class VerificationAnswersView(viewsets.ModelViewSet):
    queryset = VerificationAnswers.objects.all()
    serializer_class = VerificationAnswerSerializer
    lookup_field = 'pk'
    filterset_class = VerificationQuestionFilter


class VerificationQuestionnaireView(viewsets.ModelViewSet):
    queryset = VerificationQuestionnaire.objects.all()
    serializer_class = VerificationQuestionnaireSerializer
    lookup_field = 'pk'
    filterset_class = VerificationQuestionnaireFilter
