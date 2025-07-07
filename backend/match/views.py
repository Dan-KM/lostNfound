from django.shortcuts import render

from rest_framework import viewsets

from .serializers import LostFoundMatchSerializer

from .models import LostFoundMatch
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class LostFoundMatchView (viewsets.ModelViewSet):
    queryset = LostFoundMatch.objects.all()
    serializer_class = LostFoundMatchSerializer
    lookup_field ='pk'
    permission_classes = [IsAuthenticated]
