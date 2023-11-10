import os

from django.core.files import File
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from resources.models import Video, Audio
from resources.serializers import VideoSerializer, AudioSerailizer

from ffmpeg.audio_extractor import extract_audio
from utils.file_utils import (
    get_audio_upload_path,
    get_media_file_absolute_path,
    change_extension,
    create_folder_if_not_exits
)

class AudioExtractorView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, format=None):
        return Response('nice')

    def post(self, request, format=None):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            video = serializer.save()

            create_folder_if_not_exits(os.path.join(settings.MEDIA_ROOT, 'audios/'))

            video_file_path = video.file.path
            audio_upload_relative_path = get_audio_upload_path(None, video.get_base_file_name())
            audio_file_path = get_media_file_absolute_path(audio_upload_relative_path)
            audio_file_path = change_extension(audio_file_path, '.mp3')

            extract_audio(video_file_path, audio_file_path)

            audio = Audio(video=video)
            audio.file.name = audio_file_path
            audio.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    