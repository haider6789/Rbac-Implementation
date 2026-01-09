const pg = require('pg');

const dbConnection = async () => {

    try {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    console.log('Database connected successfully');
}catch(error){
    console.error('Database connection failed:', error);
    process.exit(1);
}
}

module.exports = dbConnection;
