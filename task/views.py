from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .forms import SignupForm
from .models import Task
from .serializers import TaskSerializer


# Create your views here.


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch", "post", "get", "delete", "head", "options"]
    filter_backends = [SearchFilter]
    search_fields = ['title']

    @action(detail=False, methods=['get'], url_path='status/(?P<status>.+)')
    def get_by_status(self, request, status=None):
        if status is not None:
            queryset = self.get_queryset().filter(status__iexact=status)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"message": "No status"})


@login_required(login_url='/auth/login')
def homepage(request):
    return render(request, 'task/index.html')


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})


def logout_view(request):
    # Log out the user
    logout(request)
    # Redirect to the login page
    return redirect('login')
