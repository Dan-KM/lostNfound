from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import LostFoundMatch
from verification.models import VerificationQuestionnaire

@receiver(post_save, sender=LostFoundMatch)
def create_questionnaire_for_match(sender, instance, created, **kwargs):
    if not created:
        return

    # Ensure we don't already have a questionnaire for this found item
    if not hasattr(instance.found_item, 'questionnaire'):
        # Use on_commit to ensure it's only created if the match was saved successfully
        transaction.on_commit(lambda: VerificationQuestionnaire.objects.create(
            found_item=instance.found_item,
        ))
