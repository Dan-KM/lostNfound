from django.core.management.base import BaseCommand
from match.util.vectorDB import VectorDB

class Command(BaseCommand):
    help = "Initialize vector DB with existing UserItem data"

    def handle(self, *args, **kwargs):
        vdb = VectorDB()
        vdb.initialize_embeddings()
        self.stdout.write(self.style.SUCCESS("Vector DB initialized with existing items."))
