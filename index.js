import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
const app = express();
const port = 3000;
const saltround=10;
const db=new pg.Client({
  user:"postgres",
 
  host:"localhost",
  database:"school",
  password:"9527396352",
  port:5432,
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
  try{const email=req.body.username;
  const password=req.body.password;
  //hashing password
  
  const checkResult=await db.query("SELECT * FROM users WHERE email=$1",[email]);
   if(checkResult.rows.length>0){
    res.send("Email already exist try logging in ,")}
    else{
    bcrypt.hash(password,saltround,async(err,hash)=>{
      if(err){
        console.log("error hashing password ",err);
      }else{
     
      const result=await db.query("INSERT INTO users(email,password) VALUES($1,$2)",[email,hash]);
      console.log(result);
      res.render("secrets.ejs")
      }
    });
  }
}catch(err){
  console.log(err);
}
    
 
  
 

 
});

app.post("/login", async (req, res) => {
 try{ const email=req.body.username;
  const password=req.body.password;
  const mycheck=await db.query("SELECT * FROM users WHERE email=$1",[email]);
  if(mycheck.rows.length>0){
    
    const storedPassword=mycheck.rows[0].password;
    bcrypt.compare(password,storedPassword,(err,result)=>{
       if(err){
        console.log("some error occured")
       }else{
        if(result){
       console.log(result);
       res.render("secrets.ejs");
    
      }else{
        res.send("email does not exist try registering")
      }
    }
      });
    }else{
      res.send("user not found");
    }
       }catch(err){
        console.log(err);
      }
    });
    

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
