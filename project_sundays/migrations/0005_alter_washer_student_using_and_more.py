# Generated by Django 4.0 on 2022-01-12 18:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project_sundays', '0004_alter_dryer_dorm_alter_dryer_student_using_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='washer',
            name='student_using',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='current_washer_user', to='auth.user'),
        ),
        migrations.AlterField(
            model_name='washer',
            name='students_reserving',
            field=models.ManyToManyField(default=None, null=True, related_name='students_reserving_washer', to=settings.AUTH_USER_MODEL),
        ),
    ]
