from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

from accounts.models import CustomUser
from notification.models import Notification
from .models import LostFoundMatch
from verification.models import VerificationQuestionnaire

def create_questionnaire_if_not_exists(found_item):
    if not hasattr(found_item, 'questionnaire'):
        VerificationQuestionnaire.objects.create(found_item=found_item)

def notify_managers_of_match(found_item, lost_item, score):
    managers = CustomUser.objects.filter(role='manager')
    for manager in managers:
        Notification.objects.create(
            recipient=manager,
            title="New Lost/Found Match",
            message=f"Item '{found_item}' has been matched to '{lost_item}' with a score of {score:.2f}.",
        )

@receiver(post_save, sender=LostFoundMatch)
def create_questionnaire_for_match(sender, instance, created, **kwargs):
    if not created:
        return

    found_item = instance.found_item
    lost_item = instance.lost_item
    score = instance.score

    def post_commit_actions():
        create_questionnaire_if_not_exists(found_item)
        notify_managers_of_match(found_item, lost_item, score)

    transaction.on_commit(post_commit_actions)
