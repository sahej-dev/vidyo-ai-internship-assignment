from django.urls import path, include

from .views import VideoWatermarkerView, VideoWatermarkerDetailView, AudioExtractorView

urlpatterns = [
    path("audio-tasks/", AudioExtractorView.as_view(), name='audio_task_list'),
    path("watermark-tasks/", VideoWatermarkerView.as_view(), name='watermarking_task_list'),
    path("watermark-tasks/<uuid:pk>/", VideoWatermarkerDetailView.as_view(), name='watermarking_task_detail'),
]
