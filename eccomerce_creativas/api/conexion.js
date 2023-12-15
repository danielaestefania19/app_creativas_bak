/*

    Programado por Luis Cabrera Benito 
  ____          _____               _ _           _       
 |  _ \        |  __ \             (_) |         | |      
 | |_) |_   _  | |__) |_ _ _ __ _____| |__  _   _| |_ ___ 
 |  _ <| | | | |  ___/ _` | '__|_  / | '_ \| | | | __/ _ \
 | |_) | |_| | | |  | (_| | |   / /| | |_) | |_| | ||  __/
 |____/ \__, | |_|   \__,_|_|  /___|_|_.__/ \__, |\__\___|
         __/ |                               __/ |        
        |___/                               |___/         
    
    
    Blog:       https://parzibyte.me/blog
    Ayuda:      https://parzibyte.me/blog/contrataciones-ayuda/
    Contacto:   https://parzibyte.me/blog/contacto/
*/
const mysql = require("mysql");
// Coloca aquí tus credenciales
module.exports = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Covid.19",
  database: "ecommerce",
});

//---
//host: process.env.DB_HOST,
//user: process.env.DB_USER,
//password: process.env.DB_PASSWORD,
//database: process.env.DB_NAME,
//---
//DB_HOST=localhost
//DB_NAME=ecommerce
//DB_USER=root
//DB_PASSWORD=Covid.19
//SESSION_KEY=6f3e8a30ed17d9ef6605d2c3b127fec9d340610dd9d3abbfd394b6c8ff0fba7c