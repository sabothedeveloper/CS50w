from django.contrib import admin
from .models import (
    User,
    UserExperience,
    UserEducation,
    UserCourse,
    UserSkill,
    UserLanguage,
    UserLink,
)
from django.contrib.auth.admin import UserAdmin


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "password", "email")


admin.site.register(User, UserAdmin)
admin.site.register(UserExperience)
admin.site.register(UserEducation)
admin.site.register(UserCourse)
admin.site.register(UserSkill)
admin.site.register(UserLanguage)
admin.site.register(UserLink)
