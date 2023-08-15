const knex = require('knex')(require('./knexfile').development);

knex.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Database connection successful!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to connect to the database!', error);
    process.exit(1);
  });
