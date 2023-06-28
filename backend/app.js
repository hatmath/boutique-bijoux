
// Projet: Boutique Ahuntsic
// Codeurs: Joseph, Isabelle, Mathieu
// Cours : Programmation Web côté serveur (420-289-AH)

//CONSTANTS

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mysql = require('mysql');
const app = express();
const path = require('path');
const bcrypt = require("bcrypt");

const secret = uuid.v4();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'tp_account_1',
  password: 'test'
});

const PAYPAL_ID = "ARPofou01ye9ITplB8G5bhwHFmmh-ltmsK9nFXQccx2-RaYllLEEnQC4exqwJZInh-h7p0YGF9GXaVhy";
const dropDB = false;

//VARIABLES

let isLoggedIn = false;
let userEmail = "none";
let idClient = "none";

//TABLES DEFINITIONS

//DEL + CREATE + USE
const deleteSchemaQuery = 'DROP SCHEMA IF EXISTS db_store;';
const createSchemaQuery = 'CREATE SCHEMA IF NOT EXISTS db_store ;';
const useSchemaQuery = 'USE db_store;';

const createClientTable = `
  CREATE TABLE IF NOT EXISTS client (
    id_client INT AUTO_INCREMENT,    
    nom VARCHAR(32),
    prenom VARCHAR(24),
    courriel VARCHAR(96),
    password VARCHAR(200),
    status BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_client)
  );
`;

const createClientAccounts = `
  INSERT IGNORE INTO client (id_client, nom, prenom, courriel, password, status)
  VALUES
    (1, 'Tremblay', 'Jean', 'email1@example.com', '$2b$10$PZTKfTaCfqvEPOdJ/1Zg1eU45rB6AFUoyJ1lpf7GgiE2tvBpNQkSS', FALSE),
    (2, 'Gagnon', 'Marie', 'email2@example.com', '$2b$10$O/W3ZXSoqZOuv8b6Qq9Wk.5E.CDGA9rjsaJ7xd8hrrnibqQhtzs5q', FALSE),
    (3, 'Roy', 'Claude', 'email3@example.com', '$2b$10$wUuaPmcapmnWKDCb5sn1suqd1ACTL0VHfXOUXRMQ6YgEC3kAxMx4.', FALSE);
`;

const createProduitTable = `
  CREATE TABLE IF NOT EXISTS produit(
    id_produit INT AUTO_INCREMENT,
    nom VARCHAR(72),
    categorie VARCHAR(32),
    prix DECIMAL(10,2),
    materiel VARCHAR(32),
    pierre VARCHAR(32),
    carat DECIMAL(4,2),
    image_url VARCHAR(192),
    origine VARCHAR(56),
    PRIMARY KEY (id_produit)
  );
`;

const insertProduits = `
  INSERT IGNORE INTO produit (id_produit, nom, categorie, prix, materiel, pierre, carat, origine, image_url)
  VALUES
    (1, 'Collier en diamant', 'Collier', 1500, 'Or blanc 18 carats', 'Diamant', 1.5, 'Burundi', '/assets/1_collier_diamand.jpg'),
    (2, 'Bague en rubis', 'Bague', 800, 'Or jaune 14 carats', 'Rubis', 0.75, 'Malawi', '/assets/2_bague_rubis.jpg'),
    (3, 'Boucles d''oreilles en émeraude', 'Boucles d''oreilles', 1200, 'Platine', 'Émeraude', 1.0, 'Liberia', '/assets/3_boucle_emeraud.jpg'),
    (4, 'Bracelet en saphir', 'Bracelet', 1800, 'Argent sterling', 'Saphir', 2.0, 'Mozambique', '/assets/4_bracelet_saphyr.jpg'),
    (5, 'Pendentif en améthyste', 'Pendentif', 400, 'Or rose 10 carats', 'Améthyste', 0.5, 'République centrafricaine', '/assets/5_pendantif_amethyst.jpg'),
    (6, 'Boucles d''oreilles en perle', 'Boucles d''oreilles', 250, 'Argent sterling', 'Perle', NULL, 'Madagascar', '/assets/6_boucle_perle.jpg'),
    (7, 'Bague en topaze', 'Bague', 350, 'Or blanc 10 carats', 'Topaze', 1.25, 'Sierra Leone', '/assets/7_bague_topaze.jpg'),
    (8, 'Bracelet en grenat', 'Bracelet', 500, 'Argent', 'Grenat', 0.75, 'Éthiopie', '/assets/8_bracelet_grenat.jpg'),
    (9, 'Collier en opale', 'Collier', 900, 'Or blanc 14 carats', 'Opale', 1.8, 'Éthiopie', '/assets/9_collierOpale.jpg'),
    (10, 'Boucles d''oreilles en citrine', 'Boucles d''oreilles', 300, 'Or jaune', 'Citrine', 1.5, 'Niger', '/assets/10_citrine.jpg');
  `;

const createCommandeTable = `
  CREATE TABLE IF NOT EXISTS commande (
    id_commande INT AUTO_INCREMENT,
    id_client INT,
    id_produit INT,
    quantite INT,
    prix_unitaire DECIMAL(10,2),
    date_commande DATETIME,
    PRIMARY KEY (id_commande),
    FOREIGN KEY (id_client) REFERENCES client (id_client),
    FOREIGN KEY (id_produit) REFERENCES produit (id_produit)
  );
`;

const insertCommandes = `
  INSERT IGNORE INTO commande (id_commande, id_client, id_produit, quantite, prix_unitaire, date_commande)
  VALUES 
    (1, 1, 1, 1, 1500, now()),
    (2, 2, 2, 1, 800, now()),
    (3, 1, 3, 1, 1200, now()),
    (4, 1, 3, 1, 1200, now());
  `;    
    
//MIDDLEWARES

app.listen(port, (res, req) => {
  console.log(`Serveur express sur le port ${port}`);
  createDBTable();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => { 
  next();
});

//ROUTES

app.get('/', (req, res) => {
  
  if (!req.session.cart) {
    req.session.cart = [];
  } 
  
  connection.query('SELECT * FROM produit', (error, rows) => {
    if (error) {
      console.error("Impossible d'executer la demande:", error);
      res.status(500).send('Erreur de serveur');
      return;
    }

    const selectHistorique = `
      SELECT p.id_produit, p.nom, p.origine, c.quantite, c.prix_unitaire, c.date_commande, c.id_client
      FROM produit p, commande c
      WHERE p.id_produit = c.id_produit AND c.id_client = ?;
    `; 

    connection.query( selectHistorique, [idClient],  
      (error, histoire) => {
        if (error) {
          console.error("Erreur dans historique:", error);
          res.status(500).send("Erreur dans historique");
        return;
        }

        res.render('index', { produits: rows, cart: req.session.cart, isLoggedIn: isLoggedIn, userEmail: userEmail, historique: histoire });
      }
    );
  });
});

app.post('/subscribe', (req, res) => {    
  const { prenom, nom, courriel, password } = req.body; 
  const saltRounds = 10;

  bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      return bcrypt.hash(password, salt);      
    })
    .then(hash => {

      const checkQuery = 'SELECT * FROM client WHERE courriel = ?';
      const checkValues = [courriel];
      connection.query(checkQuery, checkValues, (error, results) => {
        if (error) {
          res.status(500).send("Erreur de vérification de l'adresse e-mail");
        } else {
          if (results.length > 0) {
            res.render('error');
          } else {
            const insertQuery = 'INSERT INTO client (prenom, nom, courriel, password) VALUES (?, ?, ?, ?)';
            const insertValues = [prenom, nom, courriel, hash];
    
            connection.query(insertQuery, insertValues, (error, insertResults) => {
    
              if (error) {
                res.status(500).send("Erreur de création du nouveau client");
              } else {
                userEmail = courriel;
                isLoggedIn = true;
                idClient = insertResults.insertId;
                res.status(200).redirect("/");
              }
            });
          }
        }
      });
    })
    .catch(err => console.error(err.message));
});

app.post('/login', (req, res) => {
  const { email, passwordLog } = req.body;

  connection.query(
    'SELECT * FROM client WHERE courriel = ?',
    [email],
    (error, results) => {
      
      if (error) {
        console.error("Impossible de rejoindre la base de donnees : ", error);
        res.sendStatus(500);
        return;
      }

      if (results.length === 0) {
        res.render('error');
        return;
      }

      const client = results[0];

      bcrypt
        .compare(passwordLog, client.password)
        .then(response => {
          
          if (!response) {
            res.render('error');
            return;

          } else {
          
            connection.query(
              'UPDATE client SET status = ? WHERE id_client = ?',
              [true, client.id_client],
              (error) => {
                if (error) {
                  console.error("Impossible de mettre a jour le compte client : ", error);
                  res.sendStatus(500);
                  return;
                } else {                  
                  isLoggedIn = true;
                  userEmail = client.courriel;
                  idClient = client.id_client;
                  
                  res.redirect("/");      
                }
              }
            );
          }
        })
        .catch(err => console.error(err.message));     
    }
  ); 
});

app.post('/logout', (req, res) => {
  isLoggedIn = false;
  userEmail = "none";
  idClient = "none";
  req.session.cart = [];
  res.status(200).redirect("/");
});

app.post('/cart/add', function(req, res) {
  const { id_produit, quantity, price} = req.body;
  req.session.cart.push({ id_produit, quantity, price });
  res.status(200).send('Item ajoute au panier.');
});

app.delete('/cart', function(req, res) {
  req.session.cart = [];
  res.status(200).send('Panier effacer');
});

app.post('/order', function(req, res) {
  
  let insertCommande = "INSERT INTO Commande (id_client, id_produit, quantite, prix_unitaire, date_commande) VALUES ";  

  if (idClient == "none") {
    res.status(401).send("SVP vous connecter ou vous inscrire.");
  } else {
    
    req.session.cart.forEach( function(item, idx, array) {
      if (idx + 1 === array.length){ 
        insertCommande += `(${idClient}, ${item.id_produit}, ${item.quantity}, ${item.price}, now());`;
      } else {
        insertCommande += `(${idClient}, ${item.id_produit}, ${item.quantity}, ${item.price}, now()),`;
      }
    });  

    connection.query(insertCommande, (error, result) => {
      if (error) {
        res.status(500).send("Erreur de création de la commande");
      } else {
        res.status(200).send('Commandes ajoutes dans la BD');
      }
    });  

  }
});


//FUNCTIONS

function createDBTable() {

  connection.connect((err) => {

    if (err) {
      console.error('Erreur de connection a la base de donnees ', err);
      return;
    }

    console.log('Connexion reussie a la base de donnees!');

    // DEL + CREATE + USE

    if (dropDB) {
      connection.query(deleteSchemaQuery, (err) => {
        if (err) {
          console.error('Impossible de supprimer le schema : ', err);
          return;
        }});
    }
    
    connection.query(createSchemaQuery, (err) => {
      if (err) {
        console.error('Impossible de creer le schema :', err);
        return;
      }});

    connection.query(useSchemaQuery, (err) => {
      if (err) {
        console.error('Impossible de definir le schema de base :', err);        
        return;
      }});

    connection.query(createClientTable, function(err, result) {
      if (err) throw err;
    });

    connection.query(createClientAccounts, (err, result) => {
      if (err) throw err;
    });

    connection.query(createProduitTable, function(err, result) {
      if (err) throw err;
    });
    
    connection.query(insertProduits, (err, result) => {
      if (err) throw err;
    });
    
    connection.query(createCommandeTable, function(err, result) {
      if (err) throw err;
    });

    connection.query(insertCommandes, (err, result) => {
      if (err) throw err;
    });
    
    console.log("Initialisation de la base de donnees complete.")
  });
}


