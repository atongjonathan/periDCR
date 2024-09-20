from django.contrib import admin
from . models import Patient, PeriUser
from import_export.admin import ImportExportModelAdmin

class PatientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    pass

admin.site.register(Patient, PatientAdmin)
admin.site.register(PeriUser)


# Register your models here.
