const { Client } = require('pg');

const connectionString = 'postgresql://app_user.zrjzadhdwizelsfyxiqq:SimplePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    // Force IPv4
    family: 4,
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'app_user.zrjzadhdwizelsfyxiqq',
    password: 'SimplePass123',
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection failed', err);
        process.exit(1);
    });
