from django.db import models

from accounts.models import CustomUser

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'category'
        
    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')

    class Meta:
        unique_together = ('name', 'category')
        db_table = 'subcategory'

    def __str__(self):
        return self.name
    
class Item(models.Model):
    ITEM_TYPE = [
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]
    name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    item_image = models.ImageField(blank=True, null=True, upload_to='item_images/')
    location = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True, blank=True)
    item_type = models.CharField(max_length=50, choices=ITEM_TYPE)
    other_details = models.JSONField(blank=True, null=True)
    
    class Meta:
        unique_together = ('name', 'description')
        db_table = 'item'

class UserItem(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('in_office', 'In Office'),
        ('matched', 'Matched'),
        ('returned', 'Returned'),
        ('archived', 'Archived'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    serial_id = models.CharField(max_length=10, null=True, unique=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='user_items')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    reported_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('user', 'item')
        db_table = 'user_item'
    
    def save(self, *args, **kwargs):
        
        if not self.serial_id and self.item:
            prefix = ['FND', 'LST']
            last_id = UserItem.objects.count() + 1
            item_type = 'FND' if self.item.item_type == 'found' else 'LST'
            self.serial_id = f"{prefix[0 if item_type == 'FND' else 1]}-{last_id:05d}"

        super().save(*args, **kwargs)
    
    def __str__(self): 
        return f"{self.user.first_name} - {self.item.name}"