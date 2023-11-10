import os
from django.conf import settings

def get_audio_upload_path(_, filename):
    return f"audios/{filename}"

def get_media_file_absolute_path(file_path):
    media_root = settings.MEDIA_ROOT
    absolute_path = os.path.join(media_root, file_path)
    return absolute_path

def change_extension(file_path, new_extension):
    s = file_path.split('.')[:-1]
    res = '.'.join(s)

    return res + new_extension

def create_folder_if_not_exits(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
