from django.urls import path, include

from .views import (
    VideoListView,
    VideoDetailView,
    AudioListView,
    AudioDetailView
)

urlpatterns = [
    path('videos/', VideoListView.as_view(), name='video_list'),
    path('videos/<uuid:pk>/', VideoDetailView.as_view(), name='video_detail'),

    path('audios/', AudioListView.as_view(), name='audio_list'),
    path('audios/<uuid:pk>/', AudioDetailView.as_view(), name='audio_detail'),

]
