"""AppliGate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.urls import path, include

# from django.conf.urls import url
from rest_framework import routers
from app import views


router = routers.DefaultRouter()
router.register(r"user", views.SignupView.as_view(), "signup")

urlpatterns = [
    path("admin/", admin.site.urls),
    # set endpoints
    path("register/", views.SignupView.as_view()),
    path("index/", views.IndexView.as_view()),
    # Profile for user
    path("profile/", views.ProfileView.as_view()),
    path("profile/contact", views.ProfileContactView.as_view()),
    path("profile/experience", views.ProfileExperienceView.as_view()),
    path("profile/experience/<int:pk>", views.ProfileExperienceView.as_view()),
    path("profile/education", views.ProfileEducationView.as_view()),
    path("profile/education/<int:pk>", views.ProfileEducationView.as_view()),
    path("profile/course", views.ProfileCourseView.as_view()),
    path("profile/course/<int:pk>", views.ProfileCourseView.as_view()),
    path("profile/language", views.ProfileLanguageView.as_view()),
    path("profile/language/<int:pk>", views.ProfileLanguageView.as_view()),
    path("profile/skill", views.ProfileSkillView.as_view()),
    path("profile/skill/<int:pk>", views.ProfileSkillView.as_view()),
    path("profile/link", views.ProfileLinkView.as_view()),
    path("profile/link/<int:pk>", views.ProfileLinkView.as_view()),
    path("profile/about", views.ProfileAboutView.as_view()),
    # Authentication
    path("api/", include("app.api.urls")),
]
