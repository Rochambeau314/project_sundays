from django.contrib.auth.models import User, Group
from rest_framework import serializers
from project_sundays.sundays_backend.models import Student, Washer, Dryer 

class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ['token', 'dorm']
class WasherSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = Washer 
        fields = ['dorm', 'number', 'student_using', 'students_reserving']

class DryerSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = Dryer 
        fields = ['dorm', 'number', 'student_using', 'students_reserving']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    # student = StudentSerializer()

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

    def create(self, validated_data):
        student_data = validated_data.pop('student')
        user = User.objects.create(**validated_data)
        Student.objects.create(user=user, **student_data)
        return user

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']