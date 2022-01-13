from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, status, request
from project_sundays.sundays_backend.serializers import UserSerializer, GroupSerializer, StudentSerializer, WasherSerializer, DryerSerializer
from project_sundays.sundays_backend.models import Washer, Dryer

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import requests
import jwt
from rest_framework.response import Response
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny  # <-- Here
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from project_sundays.sundays_backend.secrets import client_id, client_secret


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request, format=None):
    """
    returns the current user's name and email address 
    """
    print('user_data has run')
    current_user = request.user
    current_token = request.auth
    print(current_user, current_token)
    data =  {'name': current_user.username, 'email': current_user.email}
    return Response(data=data, status=200)


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def GoogleOAuth(request, format=None):
    """
    Google OAuth: redirects the frontend with the user's token key 
    """
    if request.method == 'GET':

        # pull the data out 
        data = request.GET
        print('data', data)

        
        # pull out Google Auth code 
        gCode = data['code']

        package = {
        'code': gCode,
        'client_id': '956682115584-1od101difchaua00q2oimmnp4kurc0vu.apps.googleusercontent.com', # needs to be changed
        'client_secret': client_secret, # needs to be changed
        'redirect_uri': 'http://127.0.0.1:8000/GoogleOAuth',
        'grant_type': 'authorization_code'
        }
        
        # ask Google for access token 
        response = requests.post('https://oauth2.googleapis.com/token', data=package)
        json_response = response.json()
        print('json_response', json_response)

        # isolate the access token from the header and rest of data 
        # access_token = json_response['access_token']
        # print('access token', access_token)

        # isolate the id token from the header and rest of data 
        id_token = json_response['id_token']
        # print(id_token)

        # decode id token 
        # audience = '926069317015-pgfot71erehglt8biagmqr16p06eqa30.apps.googleusercontent.com' # why did I not need this before? 
        decoded_id_token = jwt.decode(id_token, options={"verify_signature": False})
        # print(decoded_id_token)

        # pull name and email 

        name = decoded_id_token['name'].replace(" ", "")
        user_email = decoded_id_token['email']
        user_data = name, user_email
        print(user_data)

        # search users for a current match; already existing --> sign in, no match --> create an account 

        users_response = requests.get('http://127.0.0.1:8000/users/') # grab entire list of users 
        users = users_response.json() # convert to json 
        print('list of users', users)
        


        # search for match 
        for user in users: 
            print(name, user['username'], name == user['username'])
            print(user_email, user['email'], user_email == user['email'])

            if user['username'] == name and user['email'] == user_email:
                userobj = User.objects.get(username=name)
                print(userobj)
                # print(userobj.student.token)
                print('match! sign them in!')

                # send token to frontend; frontend will sign the user in and redirect to Dashboard 
                home_link = 'http://127.0.0.1:3000/Home/' + userobj.student.token
                return redirect(home_link)
                # sessions? 
                # return so following code does not run 

        # no match: create a new account 
        # call a method to create a new user: username = name, email = user_email, student = null 
        new_user = User.objects.create(
            username = name,
            email = user_email)

        print(new_user)

        token = Token.objects.create(user=new_user)
        new_user.student.token = token.key
        new_user.save()
        # add token to student object 
        # new_user.student.access_token = access_token # currently a normal access token; will probably need to be replaced by a refresh token as AT will expire 
        # new_user.save()
    
        link = 'http://127.0.0.1:3000/NewUser/' + token.key
        return redirect(link)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_student(request, format=None):
    """
    creates a new student object linked to an existing user object,
    and sets the student's dorm to whatever was passed to this method 
    """
    student_data = request.data
    current_user = request.user 

    current_user.student.dorm = student_data['dorm']


    current_user.save()
    return Response(status=200)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_data(request, format=None):
    """
    returns all data contained in the student object of the current user 
    """
    current_user = request.user
    student = current_user.student
    serializer = StudentSerializer(student)
    print(student)
    return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_wd(request, format=None):

    # pull data out
    wd_data = request.data 

    # set vars to data 
    num_washers = int(wd_data['num_washers'])
    num_dryers = int(wd_data['num_dryers'])
    dorm = wd_data['dorm']

    # create num_washer washers, assigning dorm to what was passed and number to current_count+1 
    for x in range(0, num_washers): 
        current_washer_count = len(Washer.objects.all())
        new_washer = Washer(dorm=dorm, number = current_washer_count+1)
        new_washer.save()

    # create num_dryer dryers, assigning dorm to what was passed and number to current_count+1 
    for x in range(0, num_dryers): 
        current_dryer_count = len(Dryer.objects.all())
        new_dryer = Dryer(dorm=dorm, number = current_dryer_count+1)
        new_dryer.save()

    return Response(status=200)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_dorm_washers(request, format=None): 
    """
    returns the washers associated with the given dorm 
    """

    # pull the dorm data out of the request 
    dorm = request.data['dorm'] 
    # print(dorm)

    # pull all washers associated with the dorm
    washers = Washer.objects.filter(dorm=dorm)
    serializer = WasherSerializer(washers, many=True)
    # print(serializer.data)

    return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_dorm_dryers(request, format=None): 
    """
    returns the dryers associated with the given dorm 
    """
    # pull the dorm data out of the request 
    dorm = request.data['dorm'] 
    # print(dorm)

    # pull all dryers associated with the dorm
    dryers = Dryer.objects.filter(dorm=dorm)
    serializer = DryerSerializer(dryers, many=True)
    # print(serializer.data)

    return Response(serializer.data, status=200)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def set_washer_user(request, format=None): 
    """
    GET: adds a user to the washer, marking it as in use 
    POST: removes the user from the washer, marking it as empty 
    """


    # adds a user to the washer, marking it as in use 
    if request.method == 'GET': 
        # get user data 

        # add the user to the washer 
        
        # start the timer  

        # return success code 200 
        return Response(status=200)

    # removes the user from the washer, marking it as empty 
    else: 
        # clear the washer's data 

        # reset the timer 
        
        # send notification to user 

        # return success code 200 
        return Response(status=200)
    
@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_dryer_user(request, format=None): 
    """
    GET: adds a user to the dryer, marking it as in use 
    POST: removes the user from the dryer, marking it as empty 
    timer/sending notifications will be handled by the frontend 
    """


    # adds a user to the washer, marking it as in use 
    if request.method == 'GET': 
        # get user data 

        # add the user to the washer 
        
        # return success code 200 
        return Response(status=200)

    else: 
        # clear the dryer's data 
        
        # return success code 200 
        return Response(status=200)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_notification(request, format=None): 
    # get user data 

    # pull washer/dryer info: user, email, which washers and dryers from request

    # send email/text 

    return Response(status=200)