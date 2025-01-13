import Sequelize from 'sequelize'

export default new Sequelize(
    'telega_bot',
    'root',
    'root',
    {
        host: '192.168.203.135', // localhost
        port: '5432',
        dialect: 'postgres'
    }
)