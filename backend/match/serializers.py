from rest_framework import serializers
from .models import LostFoundMatch

class LostFoundMatchSerializer (serializers.ModelSerializer):
    class Meta: 
        model = LostFoundMatch
        fields = ['lost_item', 'found_item', 'score', 'status', 'match_at']