from django.db import models
from django.contrib.auth.models import AbstractUser


class PeriUser(AbstractUser):
    ROLE_CHOICES = (
        ("Medical Officer", "Medical Officer"),
        ("Clinical Officer", "Clinical Officer"),
        ("Nursing Officer", "Nursing Officer"),
        ("Pharmacist",  "Pharmacist"),
        ("Radiologist", "Radiologist"),
        ("Lab Technician", "Lab Technician"),
        ("Admin", "Admin"),
        ("Health Records Officer", "Health Records Officer")
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, blank=True)
    email = models.EmailField(unique=True)
    practitioner = models.CharField(max_length=50, blank=True, unique=True, null=True)

    def __str__(self) -> str:
        return f"{self.username} User"
