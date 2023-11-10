from django.contrib import admin
from .models import Video, Audio

class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'file')

class AudioAdmin(admin.ModelAdmin):
    list_display = ('file', 'video')

admin.site.register(Video, VideoAdmin)
admin.site.register(Audio, AudioAdmin)