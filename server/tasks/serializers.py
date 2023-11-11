from rest_framework import serializers

from resources.models import Video
from resources.serializers import VideoSerializer, AudioSerailizer
from .models import VideoWatermarkingTask, AudioExtractionTask

class VideoWatermarkingTaskSerializer(serializers.ModelSerializer):
    video = VideoSerializer()
    # video = serializers.PrimaryKeyRelatedField(queryset=Video.objects.all())
    watermarked_video = VideoSerializer(required=False)
    class Meta:
        fields = '__all__'
        model = VideoWatermarkingTask

class VideoWatermarkingTaskPkSerializer(VideoWatermarkingTaskSerializer):
    video = serializers.PrimaryKeyRelatedField(queryset=Video.objects.all())

class AudioExtractionTaskSerializer(serializers.ModelSerializer):
    video = VideoSerializer()
    audio_file = AudioSerailizer()

    class Meta:
        fields = '__all__'
        model = AudioExtractionTask

class AudioExtractionTaskPkSerializer(AudioExtractionTaskSerializer):
    video = serializers.PrimaryKeyRelatedField(queryset=Video.objects.all())
    audio_file = AudioSerailizer(required=False)