from rest_framework import viewsets
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Incident
from .serializers import IncidentSerializer
from django.conf import settings
from django.contrib.auth import get_user_model

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer


    def perform_create(self, serializer):
        # Sauvegarde de l'incident
        incident = serializer.save()

        # Vérifie si l'incident est de gravité "High"
        if incident.severity == 'High':
            self.send_high_severity_alert(incident)

    def send_high_severity_alert(self, incident):
        # Définir le sujet et le contenu de l'email
        subject = f'Alerte : Incident de gravité élevée - {incident.type}'
        message = (
            f"Un nouvel incident de gravité élevée a été signalé.\n\n"
            f"Titre : {incident.type}\n"
            f"Description : {incident.details}\n"
            f"Gravité : {incident.severity}\n"
            f"Créé le : {incident.timestamp}\n\n"
            f"Merci de prendre les mesures nécessaires."
        )
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user and admin_user.email:
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [admin_user.email],  # Remplacez par l'email de l'administrateur
                fail_silently=False,
            )
        # Envoyer l'email
