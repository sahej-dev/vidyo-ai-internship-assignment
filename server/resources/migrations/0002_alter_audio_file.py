# Generated by Django 4.2.7 on 2023-11-10 13:52

from django.db import migrations, models
import utils.file_utils


class Migration(migrations.Migration):

    dependencies = [
        ('resources', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audio',
            name='file',
            field=models.FileField(upload_to=utils.file_utils.get_audio_upload_path),
        ),
    ]
