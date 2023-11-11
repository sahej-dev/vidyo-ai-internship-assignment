from django.urls import path, include

from .views import VideoWatermarkerView, VideoWatermarkerDetailView, AudioExtractorView, AudioExtractorDetailView

urlpatterns = [
    path("audio-tasks/", AudioExtractorView.as_view(), name='audio_task_list'),
    path("audio-tasks/<uuid:pk>/", AudioExtractorDetailView.as_view(), name='audio_task_detail'),
    path("watermark-tasks/", VideoWatermarkerView.as_view(), name='watermarking_task_list'),
    path("watermark-tasks/<uuid:pk>/", VideoWatermarkerDetailView.as_view(), name='watermarking_task_detail'),
]
