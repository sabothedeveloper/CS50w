# for translating data to JSON
from rest_framework import serializers
from .models import (
    User,
    UserExperience,
    UserEducation,
    UserCourse,
    UserSkill,
    UserLanguage,
    UserLink,
)
from datetime import datetime


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "email",
            "date_of_birth",
            "first_name",
            "last_name",
        ]
        # read_only_fields = ["id"]
        extra_kwargs = {
            "password": {"write_only": True},
        }


class DateSerializer(serializers.Field):
    def to_internal_value(self, value):
        print(value)
        if self.field_name == "date_of_birth" and value == "":
            # raise serializers.ValidationError("This field may not be blank.")
            return None
        elif value == "":
            return None
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Invalid date format. Use 'YYYY-MM-DD'.")

    def to_representation(self, value):
        if value == "":
            return None
        return value.strftime("%Y-%m-%d")


class ProfileSerializer(serializers.ModelSerializer):
    date_of_birth = DateSerializer(allow_null=True, required=False)

    class Meta:
        model = User
        fields = [
            "current_position",
            "first_name",
            "last_name",
            "date_of_birth",
            "country",
            "city",
        ]


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "contact_email",
            "phone_number",
        ]


class MonthYearDateField(serializers.Field):
    def to_internal_value(self, value):
        # print(value)
        # if value == "":
        #     raise serializers.ValidationError("This field may not be blank.")
        if self.field_name == "from_date" and value == "":
            raise serializers.ValidationError("This field may not be blank.")
        elif value == "":
            return None
        try:
            # Parse "YYYY-MM" formatted date string and add day component as 1
            return datetime.strptime(value + "-01", "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("Invalid date format. Use 'YYYY-MM'.")

    def to_representation(self, value):
        # Convert date object to "YYYY-MM" formatted string without the day component
        if value == "":
            return None
        return value.strftime("%Y-%m")


class UserExperienceSerializer(serializers.ModelSerializer):
    from_date = MonthYearDateField(required=True)
    to_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserExperience
        fields = [
            "id",
            "position",
            "localization",
            "company",
            "from_date",
            "to_date",
            "responsibilities",
        ]


class UserEducationSerializer(serializers.ModelSerializer):
    from_date = MonthYearDateField(required=True)
    to_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserEducation
        fields = [
            "id",
            "school",
            "educational_level",
            "major",
            "specialization",
            "from_date",
            "to_date",
        ]


class UserCourseSerializer(serializers.ModelSerializer):
    finish_date = MonthYearDateField(allow_null=True, required=False)

    class Meta:
        model = UserCourse
        fields = [
            "id",
            "course_name",
            "organizer",
            "certificate_link",
            "finish_date",
        ]


class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = ["id", "skill"]


class UserLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLanguage
        fields = ["id", "language", "language_level"]


class UserLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLink
        fields = ["id", "link_name", "link"]


class UserAboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["about_me"]
