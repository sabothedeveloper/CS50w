from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from app.serializer import UserSerializer
from django.conf import settings
from django.templatetags.static import static
import os

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Define the index view function for rendering the homepage content
def index_view(request):
    index_html_path = os.path.join(settings.BASE_DIR, 'frontend', 'public', 'index.html')
    return render(request, index_html_path)
