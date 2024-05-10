
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
      user: "rjnoman002@gmail.com",
      pass: "mhsogpregadfyxda",
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

let otp;
app.post("/signup/sendotp", async (req, res) => {
    otp = generateOTP();
    const email = req.body.email; // Assuming email is sent in the request body
    

    // Send OTP to user's email
    const mailOptions = {
        from: 'rjnoman002@gmail.com',
        to: email,
        subject: 'Your OTP for LabAssist verification',
        text: `Welcome to LabAssist. Your OTP is: ${otp}. Thank you.`
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
    console.log(req.body);
    const userotp  = req.body.otp;
    console.log("Server OTP:",otp);
    console.log("User OTP:",userotp);
    if(otp == userotp){
        res.status(200).json({ message: 'OTP successfully matched' });
        
        const usersql = "INSERT INTO user (user_id, username, email, otp, usertype) VALUES(?,?,?,?,?)";
        const stdsql = "INSERT INTO student (student_id, name, dept, session, phone_no) VALUES(?,?,?,?,?)";
        
        const uservalues = [
            req.body.id,
            req.body.username,
            req.body.email,
            otp,
            req.body.usertype
        ];
            
        const stdvalues = [
            req.body.id,
            req.body.name,
            req.body.dept,
            req.body.session,
            req.body.phone_no
        ];

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
    }
    else{
        console.log("Otp didn't match");
        res.status(400).json({ error: 'OTP did not match' });
    }
  
  });
  


app.get("/", (req, res)=>{
    return res.json({"msg": "Hello world"})
})






app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
