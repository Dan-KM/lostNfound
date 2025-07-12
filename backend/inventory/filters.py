import django_filters

from .models import UserItem

class UserItemFilter(django_filters.FilterSet):
    item_type = django_filters.CharFilter(field_name='item__item_type')
    status = django_filters.CharFilter(field_name='status')

    class Meta:
        model = UserItem
        fields = ['item_type', 'status']
