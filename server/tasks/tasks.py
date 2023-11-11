from django.utils import timezone

from celery import shared_task

from resources.models import Video, Audio
from .models import VideoWatermarkingTask, AudioExtractionTask

from ffmpeg.watermarker import overlay_image
from ffmpeg.audio_extractor import extract_audio
from utils.file_utils import get_media_file_relative_path

@shared_task
def task_overlay_image(video_path, image_path, output_file, position, task_id, scale = None):
    overlay_image(video_path, image_path, output_file, position, scale = scale)

    task = VideoWatermarkingTask.objects.get(id=task_id)

    watermarked_video = Video(title=(task.video.title + ' watermarked'))
    watermarked_video.file.name = get_media_file_relative_path(output_file)
    watermarked_video.save()

    task.complete_time = timezone.now()
    task.watermarked_video = watermarked_video
    task.save()

@shared_task
def task_extract_audio(video_file_path, audio_file_path, audio_upload_relative_path, task_id):
    task = AudioExtractionTask.objects.get(id=task_id)

    extract_audio(video_file_path, audio_file_path)

    audio = Audio(video=task.video)
    audio.file.name = audio_upload_relative_path
    audio.save()
    
    task.audio_file = audio
    task.complete_time = timezone.now()
    task.save()