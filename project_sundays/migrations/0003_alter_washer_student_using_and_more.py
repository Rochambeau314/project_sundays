# Generated by Django 4.0 on 2022-01-04 21:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project_sundays', '0002_alter_dryer_student_using_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='washer',
            name='student_using',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='project_sundays.student'),
        ),
        migrations.AlterField(
            model_name='washer',
            name='students_reserving',
            field=models.ManyToManyField(default=None, null=True, to='project_sundays.Student'),
        ),
    ]
