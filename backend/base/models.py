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
        max_length=50, blank=True, unique=True, null=True)

    def __str__(self) -> str:
        return f"{self.username} User"


class PatientAutoField(models.CharField):
    def __init__(self, prefix, *args, **kwargs):
        self.prefix = prefix
        kwargs['max_length'] = kwargs.get('max_length', 50)
        super().__init__(*args, **kwargs)

    def get_next_value(self):
        last_instance = self.model.objects.all().order_by('id').last()
        if not last_instance:
            return f'{self.prefix}0001'

        last_value = str(last_instance.pk).replace(self.prefix, '')
        next_value = int(last_value) + 1
        return f'{self.prefix}{str(next_value).zfill(4)}'

    def pre_save(self, model_instance, add):
        if add and not getattr(model_instance, self.attname):
            value = self.get_next_value()
            setattr(model_instance, self.attname, value)
            return value
        return super().pre_save(model_instance, add)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs['prefix'] = self.prefix
        return name, path, args, kwargs


class Patient(models.Model):
    ehr_id = models.CharField(max_length=50, blank=True)
    uuid = models.CharField(max_length=50, blank=True)
    version_id = models.CharField(max_length=60, blank=True)
    time_created = models.DateTimeField(blank=True, null=True, auto_now_add=True)
    name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=50, blank=True)
    middle_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    dob = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    blood_group = models.CharField(max_length=50, blank=True, null=True)
    sex = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"
