from rest_framework import serializers

from resources.serializers import VideoSerializer, AudioSerailizer
from .models import VideoWatermarkingTask, AudioExtractionTask

class VideoWatermarkingTaskSerializer(serializers.ModelSerializer):
    video = VideoSerializer()
    class Meta:
        fields = '__all__'
        model = VideoWatermarkingTask

class AudioExtractionTaskSerializer(serializers.ModelSerializer):
    video = VideoSerializer()
    audio_file = AudioSerailizer()

    class Meta:
        fields = '__all__'
        model = AudioExtractionTask
