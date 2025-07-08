from django.contrib import admin

# Register your models here.
from . import models

admin.site.register(models.VerificationAnswer)
admin.site.register(models.VerificationQuestion)
admin.site.register(models.VerificationQuestionnaire)