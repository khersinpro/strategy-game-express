const { server }   = require('../server');
const config    = require('../config/index');
const database  = require('../database/index');



// Connect to Sequelize and start Express server
database.sequelize.sync()
.then(() => console.log('Connexion réussi'))
.catch((err) => console.error(err))

server.listen(config.port, () => {
    console.log('Server started on port ' + config.port + '...');
});