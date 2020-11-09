const isLocal = true;

const remote = {
  apiUrl: '',
  appUrl: '',
  db: '',
  user: 'bankevjs_nodejs',
  password: 'L7LjqsdUw7y73XM',
  jwtSecret: 'secret',
  tokenMaxAge: 24 * 60 * 60,
  emailHost: '',
  emailAuthUser: '',
  emailAuthPassword: '',
  emailfromAddress: '',
};

const port = process.env.PORT || 5000;

const config = {
  port,
  baseUrl: isLocal
    ? `http://localhost:${process.env.PORT || 5000}`
    : remote.apiUrl,
  appUrl: isLocal ? '' : remote.appUrl,
  db: isLocal ? 'bunkeeapi' : remote.db,
  user: isLocal ? 'nodejs' : remote.user,
  password: isLocal ? 'nodejs' : remote.password,
  emailHost: isLocal ? 'mail.banky.studio' : remote.emailHost,
  emailAuthUser: isLocal ? 'projects@banky.studio' : remote.emailAuthUser,
  emailAuthPassword: isLocal ? 'ukQIw#inu8bw' : remote.emailAuthPassword,
  emailfromAddress: isLocal ? 'projects@banky.studio' : remote.emailfromAddress,
  jwtSecret: remote.jwtSecret,
  tokenMaxAge: remote.tokenMaxAge,
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

helpers.capitalizeFLetters = (word) => {
  return word.replace(/^./, word[0].toUpperCase());
};

helpers.handleErrors = (err) => {
  let errors = [];
  let errorsObject = {};

  if (err.errors != undefined) {
    errorsObject.hasErrors = true;

    if (err.errors.length > 0) {
      err.errors.forEach((error) => {
        let fieldName = helpers.capitalizeFLetters(error.path);
        let message =
          error.type == 'unique violation'
            ? `The ${error.path} - ${error.value} - is already taken`
            : helpers.capitalizeFLetters(error.message);

        errors.push({
          fieldName,
          message,
        });
      });
      errorsObject.errors = errors;
    }
  } else {
    errorsObject.hasErrors = false;
    errorsObject.errors = [];
  }
  return errorsObject;
};

helpers.makeGratarUrl = (validatorModule, emailLike) => {
  const gravatar = validatorModule.makeMD5(emailLike.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${gravatar}`;
  return gravatarUrl;
};

helpers.generateError = (message, field) => {
  const errors = [];
  errors.push({ message, path: field });
  return { errors };
};

helpers.createToken = (jwtModule, obj) => {
  return jwtModule.sign(obj, config.jwtSecret, {
    expiresIn: config.tokenMaxAge,
  });
};

helpers.makeMultipleFieldUpdateData = (dataArray) => {
  const updateData = {};
  for (const data of dataArray) {
    updateData[data.name] = data.value;
  }
  return updateData;
};

module.exports = { config, schemaObjects, helpers };
