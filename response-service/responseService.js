const { Kafka } = require('kafkajs');
const express = require('express');
const dotenv = require('dotenv');
const { blockIP, quarantineArea, issuePatch } = require('./actions'); 

// Load environment variables
dotenv.config({path:'.'});

const app = express();
app.use(express.json());

// Kafka setup
const kafka = new Kafka({
    clientId: 'response-service',
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'response-service-group' });

// Listen for Kafka messages and trigger the appropriate action
const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'incident-events', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const incidentEvent = JSON.parse(message.value.toString());

            const action = incidentEvent.actionRequired;
            const details = incidentEvent.details;

            console.log(`Received message: ${JSON.stringify(incidentEvent)}`);

            switch (action) {
                case 'blockIP':
                    blockIP(details.ip);
                    break;
                case 'quarantineArea':
                    quarantineArea(details.areaId);
                    break;
                case 'issuePatch':
                    issuePatch(details.patchInfo);
                    break;
                default:
                    console.log(`Unknown action: ${action}`);
                    break;
            }
        },
    });
};

// Start the Kafka consumer
startConsumer().catch((error) => {
    console.error('Error starting consumer:', error);
});

// Start Express server for health check (optional)
app.get('/health', (req, res) => {
    res.status(200).send('Response Service is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Response Service running on port ${PORT}`);
});
