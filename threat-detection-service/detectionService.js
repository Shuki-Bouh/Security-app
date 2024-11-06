let detectionRules = [];

// Function to add a custom detection rule
const addDetectionRule = (rule) => {
    detectionRules.push(rule);
    return rule;
};

// Function to get all detection rules
const getAllDetectionRules = () => {
    return detectionRules;
};

// REST DELETE 
const deleteDetectionRuleByType = (type) => {
    const initialLength = detectionRules.length;
    detectionRules = detectionRules.filter(rule => rule.type !== type);
    return detectionRules.length < initialLength;
};

// Cette fonction utilise la condition de notre règle afin de determiner si la requete est malveillante
const detectThreat = (data) => {
    for (const rule of detectionRules) {
        if (rule.condition(data)) {
            return { type: rule.type, details: data };
        }
    }
    return null;
};

const xssDetectionRule = {
    type: 'XSS',
    condition: (data) => {
        const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|on\w+="[^"]*"/gi;
        return xssPattern.test(data);
    }
};

const sqlInjectionRule = {
    type: 'SQL Injection',
    condition: (data) => {
        // Common SQL Injection patterns
        const sqlPattern = /\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|OR|AND)\b|--|;|'|"|\/\*|\*\//gi;
        return sqlPattern.test(data);
    }
};

const commandInjectionRule = {
    type: 'Command Injection',
    condition: (data) => {
        const commandPattern = /(\bexec\b|\bping\b|\bcat\b|\bsh\b|&&|\|\||;|>|<|\|)/gi;
        return commandPattern.test(data);
    }
};

const rfiRule = {
    type: 'Remote File Inclusion',
    condition: (data) => {
        const rfiPattern = /(http:\/\/|https:\/\/|ftp:\/\/)/gi;
        return rfiPattern.test(data);
    }
};

const lfiRule = {
    type: 'Local File Inclusion',
    condition: (data) => {
        const lfiPattern = /(\.\.\/|\/etc\/passwd|\/etc\/shadow)/gi;
        return lfiPattern.test(data);
    }
};

const directoryTraversalRule = {
    type: 'Directory Traversal',
    condition: (data) => {
        const traversalPattern = /\.\.\//gi;
        return traversalPattern.test(data);
    }
};

const xxeRule = {
    type: 'XXE',
    condition: (data) => {
        const xxePattern = /<!ENTITY/gi;
        return xxePattern.test(data);
    }
};



// On ajoute toutes nos règles de détection
addDetectionRule(xssDetectionRule);
addDetectionRule(sqlInjectionRule);
addDetectionRule(commandInjectionRule);
addDetectionRule(rfiRule);
addDetectionRule(lfiRule);
addDetectionRule(directoryTraversalRule);
addDetectionRule(xxeRule);



module.exports = { 
    detectThreat, 
    addDetectionRule, 
    getAllDetectionRules, 
    deleteDetectionRuleByType 
};
