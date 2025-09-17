import django_filters

from .models import Notification

class NotificationFilter(django_filters.FilterSet):
    item_type = django_filters.CharFilter(field_name='item__item_type')

    class Meta:
        model = Notification
        fields = ['is_read']
