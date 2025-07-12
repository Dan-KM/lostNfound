from django.db import models

from inventory.models import UserItem
# Create your models here.

class LostFoundMatch(models.Model):
    lost_item = models.ForeignKey(UserItem, on_delete=models.CASCADE, related_name='lost_item_matches')
    found_item = models.ForeignKey(UserItem, on_delete=models.CASCADE, related_name='found_item_matches')
    
    # Matching score from 0–100 (or however you compute it)
    score = models.FloatField()
    
    # Match status (you or users/admins can update this later)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('resolved', 'Resolved'),
            ('rejected', 'Rejected'),
            ('expired', 'Expired'),
        ],
        default='pending'
    )
    
    matched_at = models.DateTimeField(auto_now_add=True)
    last_checked_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('lost_item', 'found_item')