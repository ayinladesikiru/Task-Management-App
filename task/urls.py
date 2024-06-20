from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, homepage, signup, logout_view


router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
    path('home/', homepage, name='home'),
    path('register/', signup),
    path('logout/', logout_view, name='logout'),
]

