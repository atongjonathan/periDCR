from django.contrib import admin
from . models import Patient
from import_export.admin import ImportExportModelAdmin

class PatientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    pass

admin.site.register(Patient, PatientAdmin)


# Register your models here.
