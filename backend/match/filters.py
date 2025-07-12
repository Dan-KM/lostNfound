import django_filters

from .models import LostFoundMatch

class LostFoundMatchFilter(django_filters.FilterSet):
    class Meta:
        model = LostFoundMatch
        fields = ['lost_item', 'status', 'found_item']
