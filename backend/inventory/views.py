from django.shortcuts import render

from rest_framework import viewsets

from .models import Category, SubCategory, Item, UserItem
# from .serializers import CategorySerializer, SubCategorySerializer, ItemSerializer, ItemCategorySerializer, ItemMetadataSerializer, UserItemSerializer
from .serializers import UserItemSerializer, ItemSerializer, CategorySerializer, SubCategorySerializer, CategoryWithSubCategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser


from django.db import transaction

# import time
# # from .util.broadcaster import broadcaster
# from django.http import StreamingHttpResponse


class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class= CategorySerializer
    lookup_field='pk'
    permission_classes = [IsAdminUser]


class SubCategoryView(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    lookup_field='pk'
    permission_classes = [IsAdminUser]

class CategoryWithSubCategoryView(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for listing categories with their subcategories.
    This viewset retrieves all categories along with their associated subcategories.
    """
    queryset = Category.objects.all()
    serializer_class = CategoryWithSubCategorySerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]
    

# class ItemView(viewsets.ModelViewSet):
#     queryset = Item.objects.all()
#     serializer_class = ItemSerializer
#     lookup_field='pk'

# class ItemView(viewsets.ModelViewSet):
#     queryset = Item.objects.all()
#     serializer_class = ItemSerializer
#     lookup_field = 'pk'
#     # permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             with transaction.atomic():
#                 item = serializer.save()
#                 user_item = UserItem.objects.create(
#                     item=item,
#                     user=request.user,  # now safe to use
#                     reported_date=serializer.validated_data.get('reported_date'),
#                     status='submitted',
#                 )
#                 user_item_serializer = UserItemSerializer(user_item)
#             return Response(user_item_serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


# class UserItemView(viewsets.ModelViewSet):
#     queryset = UserItem.objects.all()
#     serializer_class = UserItemSerializer
#     lookup_field='pk'


# class UserItemView(viewsets.ModelViewSet):
#     serializer_class = UserItemSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Default queryset is full list
#         user = self.request.user
#         if user.is_staff:
#             return UserItem.objects.all()
#         return UserItem.objects.filter(user=user)

#     @action(detail=False, methods=['get'])
#     def mine(self, request):
#         items = self.get_queryset().filter(user=request.user)
#         serializer = self.get_serializer(items, many=True)
#         return Response(serializer.data)

class UserItemView(viewsets.ModelViewSet):
    queryset = UserItem.objects.all()  # Just a placeholder
    serializer_class = UserItemSerializer
    # permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_staff:
    #         return UserItem.objects.all()
    #     return UserItem.objects.filter(user=user)

    # @action(detail=False, methods=['get'])
    # def mine(self, request):
    #     items = self.get_queryset().filter(user=request.user)
    #     serializer = self.get_serializer(items, many=True)
    #     return Response(serializer.data)



# class UserItemListView(viewsets.ReadOnlyModelViewSet):
#     """
#     A viewset for listing UserItems per user.
#     This viewset retrieves all UserItems associated with the currently authenticated user.
#     """
#     queryset = UserItem.objects.all()
#     serializer_class = UserItemSerializer
#     lookup_field = 'pk'

#     def get_queryset(self):
#         user = self.request.user
#         return UserItem.objects.filter(user=user)



# class ItemCreationViews(APIView):
#     serializer_class = ItemSerializer
#     def post(self, request):
#         item = request.data
#         itemSerilazer = ItemSerializer(data=item)
#         if itemSerilazer.is_valid():
#             with transaction.atomic():
#                 itemSerilazer.save()
#                 userItem = UserItem.objects.create(
#                     item=itemSerilazer.instance,
#                     # user=request.user,
#                     reported_date=itemSerilazer.validated_data.get('reported_date'),
#                     status='submitted',  # Assuming default status is 'available'
#                 )
#                 userItemSerializer = UserItemSerializer(userItem)
#             return Response(userItemSerializer.data, status=status.HTTP_201_CREATED)
#         return Response(itemSerilazer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# def sse_notifications(request):
#     client_id = str(time.time())  # or use user ID if authenticated
#     q = broadcaster.subscribe(client_id)

#     def event_stream():
#         try:
#             while True:
#                 data = q.get()
#                 yield f"data: {data}\n\n"
#         except GeneratorExit:
#             broadcaster.unsubscribe(client_id)

#     response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
#     response['Cache-Control'] = 'no-cache'
#     return response