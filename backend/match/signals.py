from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import LostFoundMatch
from verification.models import VerificationQuestionnaire

@receiver(post_save, sender=LostFoundMatch)
def create_questionnaire_for_match(sender, instance, created, **kwargs):
    if not created:
        return
    if not hasattr(instance.found_item, 'questionnaire'):
        transaction.on_commit(lambda: VerificationQuestionnaire.objects.create(
            found_item=instance.found_item,
        ))
