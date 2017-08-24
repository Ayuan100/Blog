module.exports = {
	host: "localhost",
	mongodb: 'mongodb://localhost/test',
	env: process.env.NODE_ENV || 'production',
	schema: 'http://',
    port: 3000,
    mongodb: 'mongodb://localhost/tm-blog',
    smtp: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'someone@example.com',
            pass: 'password'
        }
    }
};
