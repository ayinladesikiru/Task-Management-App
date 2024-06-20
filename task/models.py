from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    OVERDUE = 'OVERDUE'
    STATUS_CHOICES = [
        ('IN_PROGRESS', IN_PROGRESS),
        ('COMPLETED', COMPLETED),
        ('OVERDUE', OVERDUE)
    ]
    HIGH = 'HIGH'
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    PRIORITY_CHOICES = [
        ('HIGH', HIGH),
        ('LOW', LOW),
        ('MEDIUM', MEDIUM)
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default=IN_PROGRESS)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default=LOW)
    due_date = models.DateField()
    category = models.CharField(max_length=100)
    assigned_to = models.ForeignKey(User, on_delete=models.PROTECT)
