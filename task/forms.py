from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from django.forms import TextInput


class SignupForm(UserCreationForm):
    email = forms.EmailField(help_text="Required...")

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email']
