const { server }   = require('../server');
const config    = require('../config/index');
const { sequelize }  = require('../database/index');

// Connect to Sequelize and start Express server
sequelize.sync()
.then(() => { 
    console.log('Database connected...')    
})
.catch((err) => console.error(err))

server.listen(config.port, () => {
    console.log('Server started on port ' + config.port + '...');
});