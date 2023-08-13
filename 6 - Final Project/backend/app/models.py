from django.db import models
from django.contrib.auth.models import AbstractUser



# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    contact_email = models.EmailField(null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=20, default=None, null=True, blank=True)
    current_position = models.CharField(
        max_length=100, default=None, null=True, blank=True
    )
    about_me = models.CharField(max_length=500, null=True, blank=True)


class UserExperience(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=100, blank=False)
    localization = models.CharField(max_length=100, null=True, blank=True)
    company = models.CharField(max_length=100, null=True, blank=True)
    from_date = models.DateField(null=False, blank=False, default=None)
    to_date = models.DateField(null=True, blank=True)
    responsibilities = models.CharField(max_length=1500, null=True, blank=True)


class UserEducation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    school = models.CharField(max_length=100, blank=False)
    educational_level = models.CharField(max_length=100, blank=False)
    major = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    from_date = models.DateField(null=False, blank=False, default=None)
    to_date = models.DateField(null=True, blank=True)


class UserCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=100, blank=False)
    organizer = models.CharField(max_length=100, blank=False)
    certificate_link = models.CharField(max_length=250, null=True, blank=True)
    finish_date = models.DateField(null=True, blank=True)


class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100, blank=False)


class UserLanguage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    language = models.CharField(max_length=50, blank=False)
    language_level = models.CharField(max_length=30, blank=False)


class UserLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    link_name = models.CharField(max_length=50, blank=False)
    link = models.CharField(max_length=250, blank=False)
