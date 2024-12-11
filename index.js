import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';



// Read and parse mock data
const data = fs.readFileSync('./MOCK_DATA.json', 'utf8');
let users = JSON.parse(data);

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

const PORT =  8000;

// API Routes

// Get all users
app.get("/api/users", (req, res) => {
    try {
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = users.find(user => user.id === id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new user
app.post("/api/users", (req, res) => {
    try {
        const { first_name, last_name, email, gender, job_title } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !gender || !job_title) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = {
            id: users.length + 1,
            first_name,
            last_name,
            email,
            gender,
            job_title,
        };

        // Simulate database write with a delay
        fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(user, null, 2));

        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update user by ID
app.put("/api/users/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = users.find(user => user.id === id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { first_name, last_name, email, gender, job_title } = req.body;

        // Validate input fields
        if (!first_name || !last_name || !email || !gender || !job_title) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Update user data
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.gender = gender;
        user.job_title = job_title;

        fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete user by ID
app.delete("/api/users/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = users.findIndex(user => user.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        const deletedUser = users.splice(index, 1);

        // Simulate database write with a delay
        fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users, null, 2));

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
