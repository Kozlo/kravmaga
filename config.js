module.exports = {
    database: process.env.MONGO_URI || 'localhost/kravmaga',
    authProviderTypes: {
        auth0: "auth0_id",
        facebook: "facebook_id",
        google: "google_id"
    }
};
