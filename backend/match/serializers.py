from rest_framework import serializers
from .models import LostFoundMatch
from inventory.serializers import UserItemSerializer, ItemSerializerWithCategory as ItemSerializer
from inventory.models import UserItem

class LostFoundMatchSerializer (serializers.ModelSerializer):
    lost_item = UserItemSerializer(read_only=True)
    found_item = UserItemSerializer(read_only=True)
    class Meta: 
        model = LostFoundMatch
        fields = ['lost_item', 'found_item', 'score', 'status', 'matched_at']


class LostItemMatchSummarySerializer(serializers.ModelSerializer):
    found_item = UserItemSerializer()
    match_count = serializers.SerializerMethodField()

    class Meta:
        model = LostFoundMatch
        fields = ['found_item', 'status', 'matched_at', 'match_count']

    def get_match_count(self, obj):
        return LostFoundMatch.objects.filter(lost_item=obj.lost_item).count()

# class UserItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserItem
#         fields = ['serial_id', 'item', 'status', 'reported_date', 'updated_at']

class MatchDetailSerializer(serializers.ModelSerializer):
    lost_item = UserItemSerializer()

    class Meta:
        model = LostFoundMatch
        fields = ['lost_item', 'score', 'status']

class FoundItemMatchSerializer(serializers.ModelSerializer):
    potential_matches = serializers.SerializerMethodField()
    item = ItemSerializer()
    class Meta:
        model = UserItem
        fields = ['id','serial_id', 'item', 'status', 'reported_date', 'updated_at', 'potential_matches']

    def get_potential_matches(self, obj):
        # Assuming `obj` is a found item
        matches = LostFoundMatch.objects.filter(found_item=obj).order_by('-score')
        return MatchDetailSerializer(matches, many=True).data
    

# Alternative approach using annotations (more efficient for large datasets)
class FoundItemWithMatchesOptimizedSerializer(serializers.ModelSerializer):
    """Optimized version using database annotations"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_category = serializers.CharField(source='item.category', read_only=True)
    potential_matches = serializers.SerializerMethodField()
    
    class Meta:
        model = UserItem
        fields = [
            'id', 'serial_id', 'user_name', 'item_name', 
            'item_category', 'status', 'reported_date', 
            'updated_at', 'potential_matches'
        ]
    
    def get_potential_matches(self, obj):
        """Get potential matches using a more efficient query"""
        from django.db import models
        
        # Get lost items with match data in a single query
        lost_items = UserItem.objects.filter(
            lost_item_matches__found_item=obj
        ).select_related('user', 'item').annotate(
            match_score=models.F('lost_item_matches__score'),
            match_status=models.F('lost_item_matches__status'),
            matched_at=models.F('lost_item_matches__matched_at')
        ).order_by('-match_score')
        
        # Serialize the results
        matches_data = []
        for lost_item in lost_items:
            matches_data.append({
                'id': lost_item.id,
                'serial_id': lost_item.serial_id,
                'user_name': lost_item.user.get_full_name(),
                'item_name': lost_item.item.name,
                'item_category': lost_item.item.category,
                'status': lost_item.status,
                'reported_date': lost_item.reported_date,
                'match_score': lost_item.match_score,
                'match_status': lost_item.match_status,
                'matched_at': lost_item.matched_at,
            })
        
        return matches_data