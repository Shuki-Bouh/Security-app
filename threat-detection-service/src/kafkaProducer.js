const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'threat-detection-service',
    brokers: ['localhost:9092']  // Replace with actual Kafka broker addresses
});

const producer = kafka.producer();

const sendMessage = async ({ topic, message }) => {
    await producer.connect();
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log('Event sent to Kafka');
    } catch (error) {
        console.error('Error sending message to Kafka:', error);
    } finally {
        await producer.disconnect();
    }
};

module.exports = { sendMessage };
