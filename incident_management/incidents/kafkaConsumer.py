import json
import threading
from kafka import KafkaConsumer
from .serializers import IncidentSerializer  # Serializer pour les incidents

# Initialiser le consommateur Kafka
consumer = KafkaConsumer(
    'nom_topic_incident',
    bootstrap_servers='kafka:9092',
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='incident_consumer_group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

def process_message(message_value):
    # Utiliser le serializer pour valider et enregistrer les incidents
    serializer = IncidentSerializer(data=message_value)
    if serializer.is_valid():
        serializer.save()
        print("Incident sauvegardé depuis Kafka")
    else:
        print("Erreur de validation :", serializer.errors)

def kafka_listener():
    for message in consumer:
        incident_data = message.value
        process_message(incident_data)

# Lancer le consommateur Kafka dans un thread de fond
thread = threading.Thread(target=kafka_listener)
thread.daemon = True
thread.start()
