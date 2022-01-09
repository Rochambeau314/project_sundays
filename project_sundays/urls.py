"""project_sundays URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from project_sundays.sundays_backend import views 
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # <-- And here
    path('GoogleOAuth', views.GoogleOAuth, name = 'GoogleOAuth'),
    path('user_data', views.user_data, name = 'user_data'),
    path('create_student', views.create_student, name = 'create_student'),
    path('student_data', views.student_data, name = 'student_data'),
    path('create_wd', views.create_wd, name = 'create_wd'),
    path('get_dorm_washers', views.get_dorm_washers, name = 'get_dorm_washers'),
    path('get_dorm_dryers', views.get_dorm_dryers, name = 'get_dorm_dryers'),


]