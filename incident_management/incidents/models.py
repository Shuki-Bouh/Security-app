from django.db import models

class Incident(models.Model):
    SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    type = models.CharField(max_length=100)
    details = models.TextField()
    severity = models.CharField(max_length=6, choices=SEVERITY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.TextField(default='blockIP')
    source = models.TextField(default='ThreatDetectionService')


    def __str__(self):
        return self.type

