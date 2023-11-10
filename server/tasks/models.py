import uuid

from django.db import models

from resources.models import Video, Audio

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False,)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    schedule_time = models.DateTimeField(null=True, blank=True)
    complete_time = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        abstract = True

class AudioExtractionTask(Task):
    audio_file = models.ForeignKey(Audio, on_delete=models.CASCADE)

class VideoWatermarkingTask(Task):
    image_file = models.ImageField(upload_to='images/')
    x_pos = models.DecimalField(max_digits=12, decimal_places=11)
    y_pos = models.DecimalField(max_digits=12, decimal_places=11)
