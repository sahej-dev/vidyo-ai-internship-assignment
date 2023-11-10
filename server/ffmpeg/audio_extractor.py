import subprocess

def extract_audio(input_file, output_file):
    cmd = [
        'ffmpeg',
        '-i', input_file,
        '-vn',
        output_file
    ]

    result = subprocess.run(cmd)
