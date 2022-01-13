from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime 
from rest_framework.authtoken.models import Token


class Student(models.Model):
    # links each student to their default User model
    user = models.OneToOneField(User, on_delete=models.CASCADE) # I think this extends the User model? Not sure tbh ()

    token = models.TextField(default = "")

    DORM_LOCATIONS = [
        ('K', 'Kissam'),
        ('E', 'EBI'),
        ('Z', 'Zeppos'),
        ('Ro', 'Rothschild'),
        ('Ra', 'Rand'),
        ('B', 'Branscomb'),
        ('H', 'Highland'),
        ('C', 'Commons'),
        ('V', 'Village')
    ]
    dorm = models.CharField(
        max_length=50,
        choices=DORM_LOCATIONS,
        # default=None,
    )

    @receiver(post_save, sender=User)
    def create_student(sender, instance, created, **kwargs):
        if created:
            Student.objects.create(user=instance)
    
    @receiver(post_save, sender=User)
    def save_student(sender, instance, **kwargs):
        instance.student.save()




class Washer(models.Model):
    # location 
    DORM_LOCATIONS = [
        ('K', 'Kissam'),
        ('E', 'EBI'),
        ('Z', 'Zeppos'),
        ('Ro', 'Rothschild'),
        ('Ra', 'Rand'),
        ('B', 'Branscomb'),
        ('H', 'Highland'),
        ('C', 'Commons'),
        ('V', 'Village')
    ]
    dorm = models.CharField(
        max_length=50,
        choices=DORM_LOCATIONS,
    )
    # number 
    number = models.IntegerField()

    # student currently using; many-to-one relationship = foreign key
    student_using = models.ForeignKey(User, related_name = 'current_washer_user', on_delete=models.CASCADE, default = None, null = True)

    # students currently reserving 
    students_reserving = models.ManyToManyField(User, related_name = 'students_reserving_washer', default = None, null = True)

class Dryer(models.Model):
    # location 
    DORM_LOCATIONS = [
        ('K', 'Kissam'),
        ('E', 'EBI'),
        ('Z', 'Zeppos'),
        ('Ro', 'Rothschild'),
        ('Ra', 'Rand'),
        ('B', 'Branscomb'),
        ('H', 'Highland'),
        ('C', 'Commons'),
        ('V', 'Village')
    ]
    dorm = models.CharField(
        max_length=50,
        choices=DORM_LOCATIONS,
    )
    # number 
    number = models.IntegerField()

    # student currently using; many-to-one relationship = foreign key 
    student_using = models.ForeignKey(Student, related_name = 'current_dryer_user', on_delete=models.CASCADE, default = None, null = True)

    # students currently reserving 
    students_reserving = models.ManyToManyField(Student, related_name = 'students_reserving_dryer', default = None, null = True)