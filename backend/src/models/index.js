const mockDb = require('./mockDb');

const getModel = (mockModel, dbModelPath) => {
  return new Proxy({}, {
    get: (target, prop) => {
      const isMock = process.env.USE_MOCK_DB === 'true';
      const actualModel = isMock ? mockModel : require(dbModelPath);
      
      const value = actualModel[prop];
      if (typeof value === 'function') {
        return value.bind(actualModel);
      }
      return value;
    }
  });
};

module.exports = {
  User: getModel(mockDb.Users, './User'),
  Resource: getModel(mockDb.Resources, './Resource'),
  Experience: getModel(mockDb.Experiences, './Experience'),
  Project: getModel(mockDb.Projects, './Project'),
  Comment: getModel(mockDb.Comments, './Comment'),
  Guidance: getModel(mockDb.Guidance, './Guidance')
};
