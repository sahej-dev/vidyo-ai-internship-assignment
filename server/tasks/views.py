import os
import random
import string

from django.core.files import File
from django.conf import settings
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from resources.models import Video, Audio
from resources.serializers import VideoSerializer, AudioSerailizer

from .models import VideoWatermarkingTask, AudioExtractionTask
from .serializers import VideoWatermarkingTaskSerializer, AudioExtractionTaskSerializer

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
        
        task = tasks[0]

        og_video_path = task.video.file.path
        new_video_name, extension = os.path.splitext(og_video_path)
        random_suffix = random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
        new_video_path = f"{new_video_name}_watermarked_{random_suffix}{extension}"

        print(task.image_file.path)
        overlay_image(og_video_path, task.image_file.path, new_video_path, (task.x_pos, task.y_pos), scale=2)

        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = VideoWatermarkingTaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()

            task.schedule_time = timezone.now()
            task.save()
            og_video_path = task.video.file.path
            new_video_name, extension = os.path.splitext(og_video_path)
            random_suffix = random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=5))
            new_video_path = f"{new_video_name}_watermarked_{random_suffix}{extension}"

            overlay_image(og_video_path, task.image_file.path, new_video_path, (task.x_pos, task.y_pos), scale=2)
            return Response(VideoWatermarkingTaskSerializer(task).data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VideoWatermarkerDetailView(APIView):
    def get_object(self, pk):
        try:
            return VideoWatermarkingTask.objects.get(pk=pk)
        except VideoWatermarkingTask.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        task = self.get_object(pk)
        if task is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = VideoWatermarkingTaskSerializer(task)
        
        return Response(serializer.data)

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
    