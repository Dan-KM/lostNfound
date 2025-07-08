from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import (
    VerificationQuestionWriteSerializer,
    VerificationAnswerWriteSerializer,
    FoundItemWithQuestionnaireSerializer
)
from .models import VerificationQuestion, VerificationAnswer
from inventory.models import UserItem

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView

from rest_framework.decorators import action


# Create your views here.

class VerificationQuestionView(viewsets.ModelViewSet):
    queryset = VerificationQuestion.objects.all()
    serializer_class = VerificationQuestionWriteSerializer
    lookup_field = 'pk'

class VerificationAnswerView(viewsets.ModelViewSet):
    queryset = VerificationAnswer.objects.all()
    serializer_class = VerificationAnswerWriteSerializer
    lookup_field = 'pk'

# class FoundItemQuestionnaireView(RetrieveAPIView):
#     queryset = UserItem.objects.filter(item__item_type='found')
#     serializer_class = FoundItemWithQuestionnaireSerializer
#     permission_classes = [IsAuthenticated]

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['user'] = self.request.user
#         return context


class FoundItemQuestionnaireViewSet(viewsets.ModelViewSet):
    queryset = UserItem.objects.none()
    serializer_class = FoundItemWithQuestionnaireSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserItem.objects.filter(item__item_type='found')
    
    @action(detail=False, methods=['get'], url_path='by-serial/(?P<serial_id>[^/.]+)')
    def by_serial(self, request, serial_id=None):
        try:
            user_item = UserItem.objects.get(serial_id=serial_id, item__item_type='found')
        except UserItem.DoesNotExist:
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(user_item)
        return Response(serializer.data)