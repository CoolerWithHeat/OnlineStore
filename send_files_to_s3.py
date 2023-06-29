from django.core.management.base import BaseCommand
from django.core.files.storage import default_storage
from ProductsBase import models

class Command(BaseCommand):
    help = 'Send server-side stored files to Amazon S3'

    def handle(self, *args, **options):
        files = models.IconsForFrontend.objects.all()  # Replace `IconsForFrontend` with your actual model name

        for file_obj in files:
            file_field = file_obj.file  # Replace `file` with your actual file field name
            if file_field and file_field.storage != default_storage:
                file_field.storage.save(file_field.name, file_field)

        self.stdout.write(self.style.SUCCESS('Files sent to Amazon S3.'))
