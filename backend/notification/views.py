from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action

# Create your views here.
class NotificationView(viewsets.ModelViewSet):
    queryset = Notification.objects.none()
    serializer_class = NotificationSerializer
    lookup_field ='pk'
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        return Notification.objects.filter(recipient = self.request.user)
    
    @action(detail=False, methods=['get'])
    def mine(self):
        queryset = self.get_queryset()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
        
    
    
