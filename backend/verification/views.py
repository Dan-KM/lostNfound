from rest_framework import viewsets, status

from .filters import VerificationQuestionFilter, VerificationQuestionnaireFilter
from .serializers import (
    VerificationQuestionnaireSerializer,
    VerificationQuestionsSerializer,
    VerificationAnswerSerializer,
    VerificationQuestionCreateSerializer,
    VerificationQuestionBulkSerializer,
    LostItemWithQuestionsSerializer,
)
from .models import VerificationQuestion, VerificationAnswers, VerificationQuestionnaire
from inventory.models import UserItem

from rest_framework.response import Response
from rest_framework.decorators import action

from rest_framework.permissions import IsAuthenticated



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
    serializer_class = VerificationQuestionsSerializer

# class VerificationQuestionViewSet(viewsets.ModelViewSet):
#     queryset = VerificationQuestion.objects.all()
#     serializer_class = VerificationQuestionBulkSerializer

#     def create(self, request, *args, **kwargs):
#         is_many = isinstance(request.data, list)
#         serializer = self.get_serializer(data=request.data, many=is_many)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         return Response(serializer.data, status=201)
    
#     def update(self, request, *args, **kwargs):
#         is_many = isinstance(request.data, list)
#         if not is_many:
#             return super().update(request, *args, **kwargs)

#         # Split data
#         update_data = [item for item in request.data if 'id' in item]
#         create_data = [item for item in request.data if 'id' not in item]

#         response_data = []

#         # Handle updates
#         if update_data:
#             ids = [item['id'] for item in update_data]
#             existing_instances = VerificationQuestion.objects.filter(id__in=ids)

#             serializer = self.get_serializer(existing_instances, data=update_data, many=True)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             response_data.extend(serializer.data)

#         # Handle creations
#         if create_data:
#             serializer = self.get_serializer(data=create_data, many=True)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()
#             response_data.extend(serializer.data)

#         return Response(response_data, status=status.HTTP_200_OK)


# class VerificationAnswersView(viewsets.ModelViewSet):
#     queryset = VerificationAnswers.objects.all()
#     serializer_class = VerificationAnswerSerializer
#     lookup_field = 'pk'
#     filterset_class = VerificationQuestionFilter


class VerificationAnswersView(viewsets.ModelViewSet):
    queryset = VerificationAnswers.objects.all()
    serializer_class = VerificationAnswerSerializer
    lookup_field = 'pk'
    filterset_class = VerificationQuestionFilter

    @action(detail=False, methods=['put'], url_path='put-answer')
    def put_answer(self, request):
        answer_id = request.data.get('id', None)
        
        if answer_id:
            try:
                answer = VerificationAnswers.objects.get(id=answer_id)
            except VerificationAnswers.DoesNotExist:
                return Response({'error': 'Answer not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(answer, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        # ✅ Add this for debugging
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerificationQuestionnaireView(viewsets.ModelViewSet):
    queryset = VerificationQuestionnaire.objects.all()
    serializer_class = VerificationQuestionnaireSerializer
    lookup_field = 'pk'
    filterset_class = VerificationQuestionnaireFilter














# new Stuff

class ClaimantLostItemsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LostItemWithQuestionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        UserItem.objects.filter(user=self.request.user).prefetch_related(
            'lost_item_matches__found_item__questionnaire__questions'
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserItem
from .serializers import LostItemWithQuestionsSerializer

# class ClaimantLostItemsWithQuestionsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         print(f"🔍 Logged in as: {user}")

#         # Fetch only lost items submitted by this user
#         lost_items = UserItem.objects.filter(user=user)
#         print(f"📦 Found {lost_items.count()} lost items for user {user.first_name}")

#         # Prefetch everything needed to avoid N+1 query problem
#         lost_items = lost_items.prefetch_related(
#             'lost_item_matches__found_item__questionnaire__questions'
#         )

#         # Serialize the results
#         serializer = LostItemWithQuestionsSerializer(lost_items, many=True)

#         print("✅ Serialization complete. Returning data to frontend.")
#         return Response(serializer.data)


class ClaimantLostItemsWithQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        claimant = request.user
        lost_items = UserItem.objects.filter(user=claimant).prefetch_related(
            'lost_item_matches__found_item__questionnaire__questions',
            'lost_item_answers__question',
        )
        serializer = LostItemWithQuestionsSerializer(lost_items, many=True)
        return Response(serializer.data)