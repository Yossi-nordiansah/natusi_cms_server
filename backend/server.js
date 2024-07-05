import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "natusi_server"
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        db(null, 'public/images')
    },
    filename:(req, file, cb) => {
        db(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage
})

app.post('/upload',upload.single('image') ,(req, res) => {
    console.log(req.file)
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
    const values = [req.body.username, req.body.password];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (data.length > 0) {
            return res.status(200).json({ message: "Login Successfully" });
        } else {
            return res.status(401).json({ message: "Invalid username or password" });
        }
    });
});

app.listen(8081, () => {
    console.log("listening on port 8081...");
});
