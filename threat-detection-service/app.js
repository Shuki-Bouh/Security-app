const express = require('express');
const detectionService = require('./detectionService');
const kafkaProducer = require('./kafkaProducer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const detectedThreatsLog = [];

// Monitor data for threats
app.post('/monitor', async (req, res) => {
    try {
        const { data } = req.body;
        console.log(data);
        const threatDetected = detectionService.detectThreat(data);

        if (threatDetected) {
            detectedThreatsLog.push({ timestamp: Date.now(), ...threatDetected });

            await kafkaProducer.sendMessage({
                topic: 'incident-events',
                message: { timestamp: Date.now(), threat: threatDetected },
            });
            res.status(200).send({ message: 'Threat detected and event triggered.' });
        } else {
            res.status(200).send({ message: 'No threats detected.'});
        }
    } catch (error) {
        console.error('Error handling monitor request:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Retrieve all detected threats
app.get('/threats', (req, res) => {
    res.status(200).json(detectedThreatsLog);
});

// Add a new detection rule
app.post('/rules', (req, res) => {
    const { rule } = req.body;
    const addedRule = detectionService.addDetectionRule(rule);
    res.status(201).json({ message: 'Rule added', rule: addedRule });
});

// Get all detection rules
app.get('/rules', (req, res) => {
    const rules = detectionService.getAllDetectionRules();
    res.status(200).json(rules);
});

// Delete a detection rule by type
app.delete('/rules/:type', (req, res) => {
    const { type } = req.params;
    const deleted = detectionService.deleteDetectionRuleByType(type);
    if (deleted) {
        res.status(200).json({ message: `Rule of type '${type}' deleted.` });
    } else {
        res.status(404).json({ message: `Rule of type '${type}' not found.` });
    }
});

app.listen(PORT, () => {
    console.log(`Threat Detection Service running on port ${PORT}`);
});