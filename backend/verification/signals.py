from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import VerificationQuestion, VerificationAnswers
from inventory.models import UserItem
from .models import VerificationAnswers, VerificationQuestion

from match.models import LostFoundMatch

@receiver(post_save, sender=VerificationQuestion)
def create_answers_for_lost_items(sender, instance, created, **kwargs):
    if not created:
        return

    try:
        print('creating an empty response')
        found_item = instance.questionnaire.found_item
        print('fount_item', found_item)
        # Find all lost items matched with this found item
        matches = LostFoundMatch.objects.filter(found_item=found_item)
        print('the matches ', matches)
        for match in matches:
            lost_item = match.lost_item
            # Create a VerificationAnswer for each lost item
            VerificationAnswers.objects.create(
                question=instance,
                lost_item=lost_item,
                answer_text="",
                status=VerificationAnswers.PENDING
            )
        print ('new question added successfully')
    except Exception as e:
        # Optional: log the error or print it for debugging
        print(f"Error in signal when creating VerificationAnswers: {e}")


@receiver(post_save, sender=LostFoundMatch)
def create_answers_for_new_lost_match(sender, instance, created, **kwargs):
    if not created:
        return

    found_item = instance.found_item
    lost_item = instance.lost_item

    try:
        questionnaire = found_item.questionnaire  # OneToOne relation from UserItem → VerificationQuestionnaire
        questions = questionnaire.questions.all()  # Related name on VerificationQuestion

        for question in questions:
            VerificationAnswers.objects.create(
                question=question,
                lost_item=lost_item,
                answer_text="",
                status=VerificationAnswers.PENDING
            )
        print ('new answers created from already existing questions')
    except Exception as e:
        print(f"Error creating VerificationAnswers from new LostFoundMatch: {e}")
