import subprocess

from .utils import get_video_dimensions

def overlay_image(video_path, image_path, output_file, position, scale = None):
    v_width, v_height = get_video_dimensions(video_path)
    w_width, w_height = get_video_dimensions(image_path)

    desired_watermark_width = scale * v_width

    scale = desired_watermark_width / w_width
    pixel_position = (position[0] * v_width, position[1] * v_height)

    filter_complex = f'[1:v]scale=iw*{scale}:-1 [overlay]; '
    filter_complex += f'[0:v][overlay]overlay={pixel_position[0]}:{pixel_position[1]}'
    
    cmd = [
        'ffmpeg',
        '-i', video_path,
        '-i', image_path,
        '-filter_complex', filter_complex,
        output_file
    ]

    try:
        subprocess.run(cmd, check=True)
        print('Overlay operation completed successfully.')

    except subprocess.CalledProcessError as e:
        print('Error:', e)
