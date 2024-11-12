from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['timestamp', 'id', 'type', 'action', 'details', 'severity', 'source']


class DetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['timestamp' 'type', 'details']

class DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['ip' 'areald', 'patchinfo']


class ThreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['type' 'details']
