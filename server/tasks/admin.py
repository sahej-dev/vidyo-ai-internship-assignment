from django.contrib import admin

from .models import AudioExtractionTask, VideoWatermarkingTask

class AudioExtractionTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'video', 'audio_file')
    list_filter = ('video', 'audio_file')
    search_fields = ('video__name', 'audio_file__name')

class VideoWatermarkingTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'video', 'image_file', 'x_pos', 'y_pos')
    list_filter = ('video', 'x_pos', 'y_pos')
    search_fields = ('video__name', 'image_file')

admin.site.register(AudioExtractionTask, AudioExtractionTaskAdmin)
admin.site.register(VideoWatermarkingTask, VideoWatermarkingTaskAdmin)