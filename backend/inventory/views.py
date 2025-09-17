from django.shortcuts import render

from rest_framework import viewsets

from .filters import UserItemFilter

from .models import Category, SubCategory, Item, UserItem

from .serializers import UserItemSerializer, ItemSerializer, CategorySerializer, SubCategorySerializer, CategoryWithSubCategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend

from django.db import transaction

from django.db.models import Count
from collections import defaultdict
from datetime import datetime
from django.utils.timezone import make_aware
from .serializers import ItemReportSerializer

from notification.models import Notification

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class= CategorySerializer
    lookup_field='pk'
    # permission_classes = [IsAdminUser]


class SubCategoryView(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    lookup_field='pk'
    # permission_classes = [IsAdminUser]

class CategoryWithSubCategoryView(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for listing categories with their subcategories.
    This viewset retrieves all categories along with their associated subcategories.
    """
    queryset = Category.objects.all()
    serializer_class = CategoryWithSubCategorySerializer
    lookup_field = 'pk'
    # permission_classes = [IsAuthenticated]


class ItemView(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'pk'
    # permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("📥 Received POST request to create item")
        print("🔍 Request data:", request.data)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            print("✅ Serializer data is valid")
            try:
                with transaction.atomic():
                    item = serializer.save()
                    print("🟢 Item saved:", item)

                    user_item = UserItem.objects.create(
                        item=item,
                        user=request.user,
                        reported_date=serializer.validated_data.get('reported_date'),
                        status='submitted',
                    )
                    print("🟢 UserItem created:", user_item)

                    # Create a notification for the item submission
                    Notification.objects.create(
                        recipient=request.user,
                        title="Item Submitted Successfully",
                        message=f"Your item '{item.name}' has been successfully submitted.",
                    )
                    print("🔔 Notification created for item submission")

                    user_item_serializer = UserItemSerializer(user_item)
                    print("📤 Returning serialized user item:", user_item_serializer.data)

                return Response(user_item_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                print("❌ Exception occurred while saving item or user item:", str(e))
                return Response(
                    {"detail": "Error while saving item."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        else:
            print("❌ Serializer is invalid")
            print("🧾 Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserItemView(viewsets.ModelViewSet):
    queryset = UserItem.objects.none()
    serializer_class = UserItemSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = UserItemFilter
    filter_backends = [DjangoFilterBackend]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return UserItem.objects.all()
        return UserItem.objects.filter(user=user)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        queryset = self.get_queryset().filter(user=request.user)

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        try:
            user_item = self.get_object()
        except UserItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if not new_status:
            return Response({"detail": "Status field is required."}, status=status.HTTP_400_BAD_REQUEST)

        user_item.status = new_status
        user_item.save()

        Notification.objects.create(
            recipient=user_item.user,
            title="Item registered in office",
            message=f"The item '{user_item.item.name}' you found has been received in office.",
        )

        return Response({
            "detail": "Status updated successfully.",
            "id": user_item.id,
            "status": user_item.status
        }, status=status.HTTP_200_OK)
    

class ItemReportView(APIView):
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Validate dates
        if not start_date or not end_date:
            return Response({'detail': 'start_date and end_date are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            start = make_aware(datetime.fromisoformat(start_date))
            end = make_aware(datetime.fromisoformat(end_date))
        except ValueError:
            return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Query items
        data = (
            Item.objects
            .filter(created_at__range=(start, end))
            .values('subcategory__name', 'subcategory__category__name')
            .annotate(total=Count('id'))
            .filter(total__gt=0)
        )

        # Format report
        report = defaultdict(dict)
        for entry in data:
            category = entry['subcategory__category__name']
            subcategory = entry['subcategory__name']
            total = entry['total']
            report[category][subcategory] = total

        # Convert to serializer-compatible structure
        result = [
            {'category': cat, 'subcategories': subs}
            for cat, subs in report.items()
        ]

        serializer = ItemReportSerializer(result, many=True)
        return Response(serializer.data)
