const dns = require('dns');

console.log('Node version:', process.version);
console.log('Testing DNS lookup for db.zrjzadhdwizelsfyxiqq.supabase.co');

dns.lookup('db.zrjzadhdwizelsfyxiqq.supabase.co', (err, address, family) => {
    if (err) {
        console.error('dns.lookup failed:', err);
    } else {
        console.log('dns.lookup result:', { address, family });
    }
});

dns.resolve4('db.zrjzadhdwizelsfyxiqq.supabase.co', (err, addresses) => {
    if (err) {
        console.error('dns.resolve4 failed:', err);
    } else {
        console.log('dns.resolve4 result:', addresses);
    }
});

dns.resolve6('db.zrjzadhdwizelsfyxiqq.supabase.co', (err, addresses) => {
    if (err) {
        console.error('dns.resolve6 failed:', err);
    } else {
        console.log('dns.resolve6 result:', addresses);
    }
});
