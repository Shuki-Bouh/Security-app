from rest_framework import serializers
from .models import *

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['timestamp', 'id', 'type', 'action', 'details', 'severity', 'source']




