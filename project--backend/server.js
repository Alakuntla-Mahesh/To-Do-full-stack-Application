const express = require("express");
const path = require("path");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require('cors');

const jwt = require("jsonwebtoken")
const app = express();
app.use(cors());
app.use(express.json());
const dbPath = path.join(__dirname, "dataBase.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        const createUserInfoTableQuery = `
            CREATE TABLE IF NOT EXISTS userInfo (
                id TEXT PRIMARY KEY,
                username TEXT,
                email TEXT,
                password TEXT
            );
        `;
        await db.run(createUserInfoTableQuery);

        app.listen(3100, () => {
            console.log("Server Running at http://localhost:3100/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
    const getNameQuery = `
          SELECT
            *
          FROM
            userInfo
         `;
    const nameArray = await db.all(getNameQuery);
    response.send(nameArray);
});

app.post('/signup', async (req, res) => {
    const data = req.body;
    const { id, email, username, password } = data

    const selectUserQuery = `SELECT * FROM userInfo WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        const table = `create table '${username}'  (id text, task text, status boolean );`
        await db.run(table)
    }
    if (dbUser === undefined) {
        const insertLoginData = `
        INSERT INTO userInfo (id, username, email, password) VALUES (
        '${id}',
        '${username}',
        
        '${email}',
        '${password}'
        );`;
        const dbResponse = await db.run(insertLoginData);
        res.send({ message: 'Data received successfully' });

    } else {
        res.status(400);
        res.send("User Already Exit");
    }

})

app.post('/login', async (req, res) => {
    const data = req.body;
    const { email, password } = data
    const checkUsernameQuery = `SELECT * FROM userInfo WHERE email = '${email}'`;
    const dbUser = await db.get(checkUsernameQuery);

    if (dbUser === undefined) {
        res.status(400);
        res.send("Invalid User");
    } else {

        if (dbUser.password === password) {
            const payload = {
                email: email,
            };
            const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
            res.send({ jwtToken, username: dbUser.username });
        } else {
            res.status(400);
            res.send("Invalid Password");
        }
    }

})

app.post('/task', async (request, response) => {
    const data = request.body;
    const { id, task, status, username } = data;

    try {

        const checkQuery = `SELECT task FROM '${username}' WHERE task = '${task}'`;
        const dbUser = await db.get(checkQuery);

        if (dbUser === undefined) {

            const insertTask = `
          INSERT INTO '${username}' (id,task, status) VALUES (?,?, ?)
        `;
            await db.run(insertTask, [id, task, status]);

            response.status(201).json({ message: 'Data inserted successfully' });
        } else {

            response.status(400).json({ message: "Task already exists" });
        }
    } catch (error) {

        console.error("Error inserting task:", error.message);
        response.status(500).json({ error: "Failed to insert task" });
    }
});

app.get("/userTasks", async (req, res) => {
    const { name } = req.query;
    if (name) {
        const getNameQuery = `
        SELECT
          *
        FROM
          '${name}'
       `;
        const nameArray = await db.all(getNameQuery);
        res.send(nameArray);
    }

})

app.delete('/task/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.query;
    const deleteItemQuery = `DELETE from '${name}' where id='${id}'`;
    await db.run(deleteItemQuery);

    res.status(200)
    res.json({ message: "item is successfully deleted" })

});

app.put('/task/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { name } = req.query;
    const updateQuery = `UPDATE '${name}' SET status = ${status} WHERE  id = '${id}';`
    await db.run(updateQuery)

    res.status(200)
    res.json({ message: "item is status successfully updated" })
})
