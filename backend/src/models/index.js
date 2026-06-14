const mockDb = require('./mockDb');

if (process.env.USE_MOCK_DB === 'true') {
  module.exports = {
    User: mockDb.Users,
    Resource: mockDb.Resources,
    Experience: mockDb.Experiences,
    Project: mockDb.Projects,
    Comment: mockDb.Comments,
    Guidance: mockDb.Guidance
  };
} else {
  module.exports = {
    User: require('./User'),
    Resource: require('./Resource'),
    Experience: require('./Experience'),
    Project: require('./Project'),
    Comment: require('./Comment'),
    Guidance: require('./Guidance')
  };
}
