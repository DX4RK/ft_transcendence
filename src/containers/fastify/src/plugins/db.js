const fp = require('fastify-plugin');
const Database = require('better-sqlite3');

function createDbConnection(dbClass, options) {
  const file = options.pathToDb || ':memory:';
  const betterSqlite3Opts = options.betterSqlite3Opts || {};
  return new dbClass(file, betterSqlite3Opts);
}

function fastifyBetterSqlite3(fastify, options, next) {
  let db;

  if (options.class) {
    const dbClass = options.class;

    if (options.connection && options.connection instanceof dbClass) {
      db = options.connection;
    } else {
      db = createDbConnection(dbClass, options);
    }
  } else {
    db = createDbConnection(Database, options);
  }

  if (fastify[options.name || 'betterSqlite3']) {
    return next(new Error('plugin already registered'));
  }

  // Decorate Fastify with custom name or default 'betterSqlite3'
  fastify.decorate(options.name || 'betterSqlite3', db);

  fastify.addHook('onClose', (fastify, done) => db.close(done));

  next();
}

module.exports = fp(fastifyBetterSqlite3, {
  fastify: '5.x',
  name: 'fastify-better-sqlite3',
});
