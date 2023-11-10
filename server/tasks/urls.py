from django.urls import path, include

from .views import AudioExtractorView

urlpatterns = [
    path("audio-tasks/", AudioExtractorView.as_view(), name='audio_task_list')
]
