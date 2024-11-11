const exec = require('child_process').exec;

// structure de données pour un stcokage lors de l'execution
const blockedIps = new Set();
const quarantinedAreas = new Set();
const appliedPatches = [];

// Block IP function
const blockIp = (ip) => {
    if (!blockedIps.has(ip)) {
        console.log(`Blocking IP: ${ip}`);
        blockedIps.add(ip);

        // Utilisation de regles firewall
        exec(`sudo iptables -A INPUT -s ${ip} -j DROP`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error blocking IP ${ip}: ${stderr}`);
            } else {
                console.log(`IP ${ip} successfully blocked.`);
            }
        });
    } else {
        console.log(`IP ${ip} is already blocked.`);
    }
};

// Zone de quarantaine
const quarantineArea = (area) => {
    if (!quarantinedAreas.has(area)) {
        console.log(`Quarantining area: ${area}`);
        quarantinedAreas.add(area);
        // actions simulées
        console.log(`Area '${area}' is now quarantined.`);
    } else {
        console.log(`Area '${area}' is already quarantined.`);
    }
};

// patch de securite
const issueSecurityPatch = (patchDetails) => {
    const patchId = `patch-${Date.now()}`; 
    console.log(`Applying security patch: ${patchId}`);

    const patch = {
        id: patchId,
        details: patchDetails,
        appliedAt: new Date().toISOString(),
    };

    appliedPatches.push(patch);
    console.log(`Patch '${patchId}' applied successfully.`);
    return patch;
};

// Fonction principale pour trigger les actions
const processThreat = (threat) => {
    switch (threat.type) {
        case 'IP Threat':
            blockIp(threat.details.ip);
            break;
        case 'System Threat':
            quarantineArea(threat.details.area);
            break;
        case 'Patchable Vulnerability':
            issueSecurityPatch(threat.details.patchInfo);
            break;
        default:
            console.log(`Unknown threat type: ${threat.type}`);
    }
};

// Example: Threat handler that would be invoked upon receiving a threat from Incident Management Service
const handleThreatEvent = (threatEvent) => {
    console.log(`Received threat event: ${JSON.stringify(threatEvent)}`);
    processThreat(threatEvent);
};

// Export functions for testing and integration
module.exports = {
    blockIp,
    quarantineArea,
    issueSecurityPatch,
    handleThreatEvent,
    getBlockedIps: () => Array.from(blockedIps),
    getQuarantinedAreas: () => Array.from(quarantinedAreas),
    getAppliedPatches: () => appliedPatches,
};
