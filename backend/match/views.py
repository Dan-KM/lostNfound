from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.response import Response

from .filters import LostFoundMatchFilter

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

from .util.ItemMatcher import ItemMatcher, initialize_database

from notification.models import Notification

from rest_framework import status
from django.db import transaction
# Create your views here.



from rest_framework import status

class LostFoundMatchView(viewsets.ModelViewSet):
    queryset = LostFoundMatch.objects.all()
    serializer_class = LostFoundMatchSerializer
    lookup_field = 'pk'
    filterset_class = LostFoundMatchFilter

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        matches = self.get_queryset()
        serializer = LostItemMatchSummarySerializer(matches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='run-match')
    def run_match(self, request):
        if request.user.user_role != 'manager':
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        threshold = request.data.get('threshold')
        if threshold is None:
            return Response({"detail": "Threshold is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ItemMatcher.THRESHOLD = float(threshold)
            initialize_database()
            return Response({"detail": "Matching process initiated."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        try:
            match = self.get_object()
        except LostFoundMatch.DoesNotExist:
            return Response({"detail": "Match not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if not new_status:
            return Response({"detail": "Status field is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Update this match's status
        match.status = new_status
        match.save()

        # Delete other matches with the same found item but different ID
        deleted_count, _ = LostFoundMatch.objects.filter(
            found_item=match.found_item
        ).exclude(id=match.id).delete()

        return Response({
            "detail": "Match status updated and related matches deleted.",
            "id": match.id,
            "status": match.status,
            "other_matches_deleted": deleted_count
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], url_path='resolve-match')
    def resolve_match(self, request, pk=None):
        found_id = request.data.get("found_id")
        lost_id = request.data.get("lost_id")

        if not found_id or not lost_id:
            return Response({"detail": "Both found_id and lost_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Update both user item statuses
                from inventory.models import UserItem  # adjust import if needed

                found_item = UserItem.objects.select_for_update().get(pk=found_id)
                lost_item = UserItem.objects.select_for_update().get(pk=lost_id)

                found_item.status = "returned"
                lost_item.status = "returned"

                found_item.save()
                lost_item.save()

                # Update match status
                match = self.get_object()
                match.status = "resolved"
                match.save()

                Notification.objects.create(
                    recipient=lost_item.user,
                    title="Item returned successfully",
                    message=f"The item: {found_item.item.name} has been successfully returned.",
                )

                return Response({
                    "detail": "Match resolved and items marked as returned.",
                    "match_id": match.id,
                    "found_id": found_id,
                    "lost_id": lost_id
                }, status=status.HTTP_200_OK)

        except UserItem.DoesNotExist:
            return Response({"detail": "One or both user items not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class FoundItemMatchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet that returns a found item and its potential matches.
    Access with: /api/matches/<serial_id>/
    """
    queryset = UserItem.objects.all()
    serializer_class = FoundItemMatchSerializer
    lookup_field = 'serial_id'
    filterset_class = LostFoundMatchFilter

    def retrieve(self, request, serial_id=None):
        try:
            found_item = self.get_queryset().get(serial_id=serial_id)
        except UserItem.DoesNotExist:
            return Response({"detail": "Item not found"}, status=404)

        serializer = self.get_serializer(found_item)
        return Response(serializer.data)
