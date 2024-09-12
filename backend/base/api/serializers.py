from rest_framework import serializers
from ..models import PeriUser

class PeriUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriUser
        fields = '__all__'
