import subprocess
import asyncio

from .utils import get_video_dimensions

async def overlay_image(video_path, image_path, output_file, position, scale = None):
    print("IN OVERLAY IMAGE")
    v_width, v_height = get_video_dimensions(video_path)

    filter_complex = ''
    if scale:
        # filter_complex += f':scale=iw*{scale}:-1'
        filter_complex += f'[1:v]scale=iw*{scale}:-1 [overlay]; '

    # pixel_position = (0, 0)
    pixel_position = (position[0] * v_width, position[1] * v_height)
    # filter_complex += f'overlay={pixel_position[0]}:{pixel_position[1]}'
    filter_complex += f'[0:v][overlay]overlay={pixel_position[0]}:{pixel_position[1]}'
    # "[1:v]scale=iw*2:-1 [overlay]; [0:v][overlay]overlay=960:540"
    

    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-i', image_path,
        '-filter_complex', filter_complex,
        # '-preset', 'fast',
        # '-tune', 'fastdecode',
        output_file
    ]

    print(' '.join(cmd))

    try:
        subprocess.run(cmd, check=True)
        print('Overlay operation completed successfully.')

    except subprocess.CalledProcessError as e:
        print('Error:', e)
