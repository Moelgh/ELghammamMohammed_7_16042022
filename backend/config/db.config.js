module.exports = {
  HOST: "localhost",
  USER: "nom d'utilisateur mysql",
  PASSWORD: "mot de passe de la base de données",
  DB: "nom de la base de données",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}; 
