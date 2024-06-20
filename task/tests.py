from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse
from .models import Task


# Create your tests here.


class TaskViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="admin", email="admin@email.com", password="ILoveDjango")

    def test_that_task_created_returns_201(self):
        self.client.login(username='admin', password='ILoveDjango')
        url = reverse('tasks-list')
        data = {"title": "Learning how to drive",
                "description": "because its a essential skill to have",
                "due_date": "2024-06-22",
                "category": "Skill and Automobile",
                "assigned_to": self.user.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_that_task_created_with_bad_data_returns_400(self):
        url = reverse('tasks-list')
        data = {'title': 'a', 'description': 'hello', 'due_date': '22/06/2024', 'category': 'hi', 'assigned_to': 1}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_to_get_list_of_task_returns_200(self):
        url = reverse('tasks-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TaskIntegrationTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="admin", email="admin@email.com", password="ILoveDjango")
        self.client = Client()
        self.url = reverse('tasks-list')

    def test_task_list_integration(self):
        Task.objects.create(title="Learning how to drive",
                            description="because its a essential skill to have",
                            due_date="2024-06-22",
                            category="Skill and Automobile",
                            assigned_to=self.user)
        response = self.client.get(path=self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Learning")
