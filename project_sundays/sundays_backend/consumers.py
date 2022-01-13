import json
from project_sundays.sundays_backend.models import Washer, Dryer, Student
from rest_framework.authtoken.models import Token
from project_sundays.sundays_backend.serializers import UserSerializer, GroupSerializer, StudentSerializer, WasherSerializer, DryerSerializer
import requests
import time 
import threading
from channels.generic.websocket import WebsocketConsumer
from project_sundays.sundays_backend.views import get_dorm_washers 

class WasherConsumer(WebsocketConsumer):
    def connect(self): 
        self.me = self.scope.get('user')
        self.accept()

    def expire_reservation(self, user, washer, token, data):
        washer.students_reserving.remove(user)
        washer.save()
        washer_serializer = WasherSerializer(Washer.objects.all(), context = {'request': requests.post('http://127.0.0.1:8000/get_dorm_washers', headers = {"Authorization": token}, json = data)}, many=True)

        self.send(text_data = json.dumps(washer_serializer.data))


    def receive(self, text_data):
        json_data = json.loads(text_data)
        # print(json_data)
        token = "Token " + json_data['user']
        data = {"dorm": "kissam"}
        print(token)
        user = Token.objects.get(key=json_data['user']).user
        student = Student.objects.get(user=user)
        washer = Washer.objects.get(number=json_data['number'])
        

        if json_data['action'] == 'add to waitlist': 
            washer.students_reserving.add(user)
            washer.save()
            washer_serializer = WasherSerializer(Washer.objects.all(), context = {'request': requests.post('http://127.0.0.1:8000/get_dorm_washers', headers = {"Authorization": token}, json = data)}, many=True)
            # print(washer_serializer.data)  
            self.send(text_data = json.dumps(washer_serializer.data))
            t = threading.Timer(10.0, lambda: self.expire_reservation(user, washer, token, data))
            t.start()


        elif json_data['action'] == 'mark as in-use': 
            washer.student_using = user 
            washer.save() 

        elif json_data['action'] == 'pull data':
            washer_serializer = WasherSerializer(Washer.objects.all(), context = {'request': requests.post('http://127.0.0.1:8000/get_dorm_washers', headers = {"Authorization": token}, json = data)}, many=True)
            self.send(text_data = json.dumps)
        else:
            print('error')
    



class DryerConsumer(WebsocketConsumer):
    def connect(self): 
        self.user = self.scope['user']
        print('connected! ', self.user)
        self.accept()  

    def receive(self, text_data): 
        json_data = json.loads(text_data)
        print(json_data)
        self.send(text_data = json.dumps(json_data))

    # change the current user of a washer 
    def change_washer_user(self): 
        self.send(json.dumps({'message': 'change_washer_user'})) 

    