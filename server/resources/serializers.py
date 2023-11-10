from rest_framework import serializers

from .models import Video, Audio

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'title',
            'file'
        )
        model = Video

class AudioSerailizer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'id',
            'file',
            'video',
        )
        model = Audio