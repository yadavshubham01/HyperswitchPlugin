const determineProjectConfig = (req, res, next) => {
    const projectKey = req.headers['x-project-key'];

    if (!projectKey) {
        return res.status(400).json({ error: 'Project key header is missing' });
    }

    const commercetoolsConfig = getCommercetoolsConfig(projectKey);

    if (!commercetoolsConfig) {
        return res.status(404).json({ error: 'Project configuration not found' });
    }

    req.commercetoolsConfig = commercetoolsConfig;
    next();
};

// Function to get the configuration for a project
const getCommercetoolsConfig = (projectKey) => {
    const configurations = {
        'project1': {
            projectKey: process.env.PROJECT1_KEY,
            apiToken: process.env.PROJECT1_API_TOKEN
        },
        'project2': {
            projectKey: process.env.PROJECT2_KEY,
            apiToken: process.env.PROJECT2_API_TOKEN
        }
    };

    return configurations[projectKey];
};

module.exports = determineProjectConfig;
