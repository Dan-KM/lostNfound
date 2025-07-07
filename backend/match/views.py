from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.response import Response

from .serializers import (
    LostFoundMatchSerializer, 
    FoundItemMatchSerializer, 
    LostItemMatchSummarySerializer,
    FoundItemWithMatchesOptimizedSerializer
    )

from .models import LostFoundMatch
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import action
from rest_framework.response import Response

from inventory.models import UserItem
# Create your views here.

class LostFoundMatchView(viewsets.ModelViewSet):
    queryset = LostFoundMatch.objects.all()
    serializer_class = LostFoundMatchSerializer  # default serializer
    lookup_field = 'pk'
    # permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """
        Return summary of all matches using a different serializer.
        """
        matches = self.get_queryset()
        serializer = LostItemMatchSummarySerializer(matches, many=True)
        return Response(serializer.data)

class FoundItemMatchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet that returns a found item and its potential matches.
    Access with: /api/matches/<serial_id>/
    """
    queryset = UserItem.objects.all()
    serializer_class = FoundItemMatchSerializer
    lookup_field = 'serial_id'

    def retrieve(self, request, serial_id=None):
        try:
            found_item = self.get_queryset().get(serial_id=serial_id)
        except UserItem.DoesNotExist:
            return Response({"detail": "Item not found"}, status=404)

        serializer = self.get_serializer(found_item)
        return Response(serializer.data)
    