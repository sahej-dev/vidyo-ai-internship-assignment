from django.db.models import Q
from django.shortcuts import render

from rest_framework import generics

from .models import Video, Audio
from tasks.models import VideoWatermarkingTask
from .serializers import VideoSerializer, AudioSerailizer

class VideoListView(generics.ListCreateAPIView):
    serializer_class = VideoSerializer

    def get_queryset(self):
        return Video.objects.exclude(id__in=VideoWatermarkingTask.objects.values('watermarked_video_id'))
    

class VideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VideoSerializer
    queryset = Video.objects.all()

class AudioListView(generics.ListCreateAPIView):
    serializer_class = AudioSerailizer
    queryset = Audio.objects.all()

class AudioDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AudioSerailizer
    queryset = Audio.objects.all()
