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
    practitioner = models.CharField(
        max_length=50, blank=True)

    def __str__(self) -> str:
        return f"{self.username} User"


class Patient(models.Model):
    ehr_id = models.CharField(max_length=50, blank=True)
    uuid = models.CharField(max_length=50, blank=True)
    version_id = models.CharField(max_length=60, blank=True)
    time_created = models.DateTimeField(blank=True, auto_now_add=True, null=True)
    uuid = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    dob = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(max_length=50, blank=True)
    blood_group = models.CharField(max_length=50, blank=True)
    sex = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.name}"
