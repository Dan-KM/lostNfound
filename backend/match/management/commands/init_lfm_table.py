from django.core.management.base import BaseCommand
from match.util.ItemMatcher import initialize_database

class Command(BaseCommand):
    help = "Initialize the database and run matching logic"

    def handle(self, *args, **kwargs):
        initialize_database()
