let helpers = {};

// A utility function to check if an Object is empty or not
helpers.isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

// Helper function to calculate discounted costs
helpers.discounted = (cost, percentage) => {
    return cost - ((cost / 100) * percentage);
};

module.exports = helpers;
