import json
import threading
from kafka import KafkaConsumer, KafkaProducer
from .serializers import *  # Serializer pour les incidents

# Initialiser le consommateur Kafka
consumer = KafkaConsumer(
    'incident-events',
    bootstrap_servers='kafka:9092',
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='incident_consumer_group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

producer = KafkaProducer(
    bootstrap_servers='kafka:9092',
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

def action(type):
    todo = "blockIP"
    severity = "high"
    return todo, severity

def send_response_to_kafka(incident):

    response = action(str(incident.type))
    # Format de la réponse JSON
    response_message = {
        "timestamp": str(incident.timestamp),
        "incidentId": str(incident.id),
        "type": str(incident.type),
        "action": response[0],
        "details": {
            "ip": incident.details.get("ip", "unknown"),
            "areaId": "database_server_1",
            "patchInfo": "Critical security update version 1.2"
        },
        "severity": response[1],
        "source": "ThreatDetectionService"
    }
    # Envoi du message à Kafka
    producer.send('incident-events', value=response_message)
    producer.flush()
    print("Message envoyé à Kafka :", response_message)


def process_message(message_value):
    # Utiliser le serializer pour valider et enregistrer les incidents
    incident_data = {
        "timestamp": message_value["timestamp"],
        "type": message_value["threat"]["type"],
        "details": message_value["threat"]["details"]
    }
    print(incident_data)
    serializer = DetectionSerializer(data=incident_data)
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
