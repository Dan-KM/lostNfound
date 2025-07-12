from rest_framework import serializers

from accounts.serializers import CustomUserSimpleSerializer
from .models import Item, SubCategory, Category, UserItem
# from .models import Category, ItemMetadata, UserItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'category', 'name']

class CategoryWithSubCategorySerializer(serializers.ModelSerializer):
    subcategory = SubCategorySerializer(many=True, read_only=True, source='subcategories')

    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategory']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields ='__all__'

class ItemSerializerWithCategory(serializers.ModelSerializer):
    category = CategorySerializer()
    subcategory = SubCategorySerializer()
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'category', 'subcategory', 'location']

class UserItemSerializer(serializers.ModelSerializer):
    item = ItemSerializerWithCategory(read_only = True)
    user = CustomUserSimpleSerializer(read_only = True)
    class Meta:
        model = UserItem
        fields = ['id', 'user', 'serial_id','status', 'reported_date', 'item', 'updated_at']