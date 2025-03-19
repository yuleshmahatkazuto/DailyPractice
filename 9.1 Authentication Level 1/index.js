import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: 'postgres',
  password: 'Yulrubis@58',
  database: 'passwordAuth',
  host: 'localhost',
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email, password);
  if(email && password){
    console.log("Inside if statmenet");
    try{
      await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
      res.render("secrets.ejs");
    } catch(error){
      res.status(400).json({message: "The email has been already registered. Please try a different one"});
    }    
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const result = await db.query(`
      SELECT email, password 
      FROM users
      WHERE email = $1
    `, [email]); 
  if (result.rows.length === 0){
    return res.send("The email address does not exist in the database.");
  } 
  const DbEmail = result.rows[0].email;
  const DbPassword = result.rows[0].password;
  if(email === DbEmail && DbPassword === password){
    res.render("secrets.ejs");
  } else{
    res.status(400).json({message: "The username and password entered was incorrect"});
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

});
