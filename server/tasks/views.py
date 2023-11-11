import os
import random
import string

from django.core.files import File
from django.conf import settings
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, generics
from django_celery_results.models import TaskResult
from celery.result import AsyncResult

from resources.models import Video, Audio
from resources.serializers import VideoSerializer, AudioSerailizer

from .models import VideoWatermarkingTask, AudioExtractionTask
from .serializers import (VideoWatermarkingTaskSerializer, VideoWatermarkingTaskPkSerializer, AudioExtractionTaskSerializer)
from .tasks import task_overlay_image

from ffmpeg.watermarker import overlay_image
from ffmpeg.audio_extractor import extract_audio
from utils.file_utils import (
    get_audio_upload_path,
    get_media_file_absolute_path,
    change_extension,
    create_folder_if_not_exits
)

class VideoWatermarkerView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, format=None):
        tasks = VideoWatermarkingTask.objects.all()
        serializer = VideoWatermarkingTaskSerializer(tasks, many=True)
 
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = VideoWatermarkingTaskPkSerializer(data=request.data)

        if serializer.is_valid():
            task = serializer.save()

            task.schedule_time = timezone.now()

            og_video_path = task.video.file.path
            new_video_name, extension = os.path.splitext(og_video_path)
            random_suffix  = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
            new_video_path = f"{new_video_name}_watermarked_{random_suffix}{extension}"

            res = task_overlay_image.delay(og_video_path, task.image_file.path, new_video_path, (task.x_pos, task.y_pos), task.id, scale=task.scale)

            task.celery_task_id = res.id
            task.save()
            return Response(VideoWatermarkingTaskSerializer(task).data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(request.data, status=status.HTTP_400_BAD_REQUEST)
    

class VideoWatermarkerDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = VideoWatermarkingTaskSerializer
    queryset = VideoWatermarkingTask.objects.all()

    def perform_destroy(self, instance):
        AsyncResult(instance.celery_task_id).revoke(terminate=True)
        instance.delete()
   
class AudioExtractorView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, format=None):
        tasks = AudioExtractionTask.objects.all()
        serializer = AudioExtractionTaskSerializer(tasks, many=True)

        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            video = serializer.save()
            task = AudioExtractionTask(video=video, schedule_time=timezone.now())

            create_folder_if_not_exits(os.path.join(settings.MEDIA_ROOT, 'audios/'))

            video_file_path = video.file.path
            audio_upload_relative_path = get_audio_upload_path(None, video.get_base_file_name())
            audio_upload_relative_path = change_extension(audio_upload_relative_path, '.mp3')
            audio_file_path = get_media_file_absolute_path(audio_upload_relative_path)

            extract_audio(video_file_path, audio_file_path)

            audio = Audio(video=video)
            audio.file.name = audio_upload_relative_path
            audio.save()
            
            task.audio_file = audio
            task.complete_time = timezone.now()
            task.save()

            task_serializer = AudioExtractionTaskSerializer(task)
            return Response(task_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    