from rest_framework import serializers
from ..models import PeriUser, Patient

class PeriUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriUser
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
