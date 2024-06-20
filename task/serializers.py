from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    # user_id = serializers.UUIDField(source='assigned_to.external_id', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'due_date', 'category', 'assigned_to']

    def validate(self, attrs):
        print(f"validate serializer {attrs}")
        return super().validate(attrs)


class UserSerializer(UserCreateSerializer):
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta(UserCreateSerializer.Meta):
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.pop('confirm_password', None)

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})

        validate_password(password)

        return attrs

