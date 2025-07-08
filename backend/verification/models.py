from django.db import models

from accounts.models import CustomUser
from inventory.models import UserItem

# Create your models here.

class VerificationQuestionnaire(models.Model):
    found_item = models.OneToOneField(UserItem, on_delete=models.CASCADE, related_name="questionnaire")
    created_at = models.DateTimeField(auto_now_add=True)
    # created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"Questionnaire for {self.found_item.serial_id}"


class VerificationQuestion(models.Model):
    questionnaire = models.ForeignKey(VerificationQuestionnaire, on_delete=models.CASCADE, related_name="questions")
    text = models.CharField(max_length=255)
    is_required = models.BooleanField(default=True)
    # order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Q: {self.text}"

class VerificationAnswer(models.Model):
    question = models.ForeignKey(VerificationQuestion, on_delete=models.CASCADE)
    claimant = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    answer_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
