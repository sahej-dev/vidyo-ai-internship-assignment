import subprocess
import re

def get_video_dimensions(video_path):
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'csv=s=x:p=0',
            video_path
        ]
        result = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)

        width, height = map(int, result.strip().split('x'))
        print("DIMS OF VIDEO ARE:")
        return (width, height)

    except subprocess.CalledProcessError as e:
        print(f"Error getting video dimensions: {e}")
