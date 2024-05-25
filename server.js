
import express from 'express';
import cors from 'cors';
import mysql from "mysql";
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure nodemailer to send emails
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "rjnoman003@gmail.com",
      pass: "uxcexizxtlukhtin",
    },
  });

  // Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "labreact"
});
db.connect();


app.post("/signup/saveusers", async (req, res)=>{
    const userotp = generateOTP();
    
    
    const usersql = "INSERT INTO user (user_id, username, email, usertype, otp, is_active) VALUES(?,?,?,?,?,?)";
    const stdsql = "INSERT INTO student (student_id, name, dept, session, phone_no) VALUES(?,?,?,?,?)";
    const pwdsql = "INSERT INTO password (email, password) VALUES(?,?)";
    
    const is_active = 0;

    const uservalues = [
        req.body.id,
        req.body.username,
        req.body.email,
        req.body.usertype,
        userotp,
        is_active
    ]; 
    const stdvalues = [
        req.body.id,
        req.body.name,
        req.body.dept,
        req.body.session,
        req.body.phone_no
    ];
    const passvalues = [
        req.body.email,
        req.body.password
    ];
    try{
        await new Promise((resolve, reject) => {
            db.query(usersql, uservalues, (error, data) => {
                if (error) reject(error);
                else resolve();
            });
        }); 

        await new Promise((resolve, reject) => {
            db.query(stdsql, stdvalues, (error, data) => {
                if (error) reject(error);
                else resolve();
            });
        });

        await new Promise((resolve, reject) => {
            db.query(pwdsql, passvalues, (error, data) => {
                if (error) reject(error);
                else resolve();
            });
        });

        res.status(200).send("User successfully saved."); // Send a success response
    }catch (error) {
        res.status(500).send("Error saving user."); // Send an error response
    }
});


app.post("/signup/sendotp", async (req, res)=>{
    const email = req.body.email;
    let dbotp;
    const getotpsql = "select otp from user where email=?";
    dbotp = await new Promise((resolve, reject) => {
        db.query(getotpsql, [email], (error, data) => {
            if (error) reject(error);
            else {
                resolve(data);
            }

        });
    });
    console.log(dbotp[0].otp);

    // Send OTP to user's email
    const mailOptions = {
        from: 'rjnoman003@gmail.com',
        to: email,
        subject: 'Your OTP for LabAssist verification',
        text: `Welcome to LabAssist. Your OTP is: ${dbotp[0].otp}. Thank you.`
        };
        
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error('Error sending email: ' + error.message);
        res.status(500).send('Error sending OTP');
        } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('OTP sent successfully');
        }
    }); 
});

 app.post('/users/register', async (req, res) => {
    const email = req.body.email;
    console.log(req.body);
    const userotp  = req.body.otp;
    console.log("User OTP:",userotp);

    let dbotp;
    const getotpsql = "select otp from user where email=?";
    dbotp = await new Promise((resolve, reject) => {
        db.query(getotpsql, [email], (error, data) => {
            if (error) reject(error);
            else {
                resolve(data);
            }

        });
    });

    if(dbotp[0].otp == userotp){
        res.status(200).json({ message: 'OTP successfully matched' });
        
        const updateusersql = "UPDATE user SET is_active=1 where email=?";
        await new Promise((resolve, reject) => {
            db.query(updateusersql, [email], (error, data) => {
                if (error) reject(error);
                else resolve();
            });
        });   
    }
    else{
        console.log("Otp didn't match");
        res.status(400).json({ error: 'OTP did not match' });
    }
  });

  app.post("/users/login", async (req, res)=>{
    const {email, password}= req.body;
    console.log("REq: ", req.body);
    console.log("User mail: ", email);
    console.log("userpwd: ",password);
    const activesql = "Select is_active from user where email=?";
    let dbstatus = await new Promise((resolve, reject) => {
        db.query(activesql, [email], (error, data) => {
            if (error) reject(error);
            else {
                resolve(data);
            }

        });
    });
    // console.log("DBSTATUS: ",dbstatus[0].is_active);
    if(dbstatus[0].is_active == 1){
        const loginsql = "select password from password where email=?";

        let dbpwd = await new Promise ((resolve, reject) =>{
            db.query(loginsql, [email], (error, data)=>{
                if(error) reject(error);
                else resolve(data);
            });
        });
        console.log("password: ", dbpwd[0].password);
        if(dbpwd[0].password === password){
            res.status(200).json({ message: 'Password successfully matched.' });
        }else{
            res.status(400).json({ error: 'Password did not match.' });
        }
    }else{
        console.log("Account not activated.");
    }

  })

  app.post("/profile/showdata", async (req, res) => {
    const email = req.body.email;
    console.log(email);
    // const usersql = "SELECT * FROM student WHERE student_id = (SELECT user_id FROM user WHERE email=?)";
  const usersql = "SELECT s.*, u.username, u.email, u.usertype FROM student s JOIN user u ON s.student_id = u.user_id WHERE u.email = ?"
    try {
      const dbstddata = await new Promise((resolve, reject) => {
        db.query(usersql, [email], (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
  
      console.log("server side: ",dbstddata[0]);
      res.json(dbstddata[0]); // Send the response after the data is resolved
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).send("Internal Server Error"); // Send an error response if there's an issue
    }
  });
  
  app.get("/api/inventory", async (req, res) => {
    try {
      const getInventorySql = "SELECT * FROM inventory";
      db.query(getInventorySql, (error, data) => {
        if (error) {
          console.error("Error fetching inventory:", error);
          res.status(500).send("Internal Server Error"); // Send error response
        } else {
          // Send the inventory data as an array of objects
          res.json(data);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error"); // Handle errors
    }
  });

  // API endpoint to create a new product
app.post("/api/inventory/create", async (req, res) => {
    try {
      const { product_name, quantity } = req.body;
      console.log("Save: ",req.body);
      const createProductSql = "INSERT INTO inventory (product_name, quantity) VALUES (?, ?)";
      db.query(createProductSql, [product_name, quantity], (error, result) => {
        if (error) {
          console.error("Error creating product:", error);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Product created successfully");
          res.status(200).send("Product created successfully");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // API endpoint to update a product
app.put("/api/inventory/update/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const { product_name, quantity } = req.body;
      const updateProductSql = "UPDATE inventory SET product_name = ?, quantity = ? WHERE product_id = ?";
      db.query(updateProductSql, [product_name, quantity, productId], (error, result) => {
        if (error) {
          console.error("Error updating product:", error);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Product updated successfully");
          res.status(200).send("Product updated successfully");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });

// API endpoint to delete a product
app.delete("/api/inventory/delete/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const deleteProductSql = "DELETE FROM inventory WHERE product_id = ?";
      db.query(deleteProductSql, [productId], (error, result) => {
        if (error) {
          console.error("Error deleting product:", error);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("Product deleted successfully");
          res.status(200).send("Product deleted successfully");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  
app.get("/", (req, res)=>{
    return res.json({"msg": "Hello world"})
})


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
