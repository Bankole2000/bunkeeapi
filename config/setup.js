const isLocal = true;

const remote = {
  url: '',
  db: '',
  user: 'bankevjs_nodejs',
  password: 'L7LjqsdUw7y73XM',
  jwtSecret: 'secret',
};

const config = {
  baseUrl: isLocal
    ? `http://localhost:${process.env.PORT || 5000}`
    : remote.url,
  db: isLocal ? 'noderestapi' : remote.db,
  user: isLocal ? 'nodejs' : remote.user,
  password: isLocal ? 'nodejs' : remote.password,
  jwtSecret: remote.jwtSecret,
};

// Resource Schemas
const schemaObjects = {};

schemaObjects.user = (id) => {
  return {
    attributes: {},
    relations: {},
    methods: {},
    urls: {},
  };
};

// Helper functions
const helpers = {};

module.exports = { config, schemaObjects, helpers };
