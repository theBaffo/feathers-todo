const { authenticate } = require('@feathersjs/authentication').hooks;
const { setField } = require('feathers-authentication-hooks');

const processTodo = require('../../hooks/process-todo');

const limitToUser = setField({
  from: 'params.user._id',
  as: 'params.query.userId'
});

const setUserId = setField({
  from: 'params.user._id',
  as: 'data.userId'
});

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ limitToUser ],
    get: [ limitToUser ],
    create: [ processTodo(), setUserId ],
    update: [ limitToUser, processTodo(), setUserId ],
    patch: [ limitToUser, processTodo(), setUserId ],
    remove: [ limitToUser ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
