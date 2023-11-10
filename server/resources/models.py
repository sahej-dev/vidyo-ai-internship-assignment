import os
import uuid

from django.db import models

from utils.file_utils import get_audio_upload_path

class Video(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='videos/')

    def __str__(self) -> str:
        return self.title

    def get_base_file_name(self) -> str:
        return os.path.basename(self.file.name)
    

class Audio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,)
    file = models.FileField(upload_to=get_audio_upload_path)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
