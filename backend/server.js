const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDb, initDb } = require('./db');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'railswift_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Initialize DB setup before routes
initDb().catch(err => {
    console.error('Failed to initialize database', err);
});

// Auth Routes
app.post('/api/signup', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const db = await getDb();
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Train Routes
app.get('/api/trains', async (req, res) => {
    const { from, to } = req.query;
    try {
        const db = await getDb();
        let query = 'SELECT * FROM trains';
        let params = [];
        
        if (from && to) {
            query += ' WHERE LOWER(fromCity) = LOWER(?) AND LOWER(toCity) = LOWER(?)';
            params = [from, to];
        }
        
        let filtered = await db.all(query, params);
        
        // Deserialize coaches since SQLite doesn't natively support arrays
        filtered = filtered.map(t => {
            t.coaches = JSON.parse(t.coaches);
            // Re-map fromCity, toCity back to from, to match frontend expectation
            t.from = t.fromCity;
            t.to = t.toCity;
            return t;
        });

        // Dynamic trains fallback (for demo) if less than 5 found
        if (from && to && filtered.length < 5) {
            const needed = 5 - filtered.length;
            const dynamicTrains = [];
            for (let i = 0; i < needed; i++) {
                const hour = Math.floor(Math.random() * 14 + 6);
                const arrivalHour = (hour + Math.floor(Math.random() * 6 + 4)) % 24;
                dynamicTrains.push({
                    id: `D${Math.floor(100 + Math.random() * 900)}${i}`,
                    name: `${from}-${to} Express ${i + 1}`,
                    from,
                    to,
                    departure: `${hour.toString().padStart(2, '0')}:00`,
                    arrival: `${arrivalHour.toString().padStart(2, '0')}:30`,
                    price: 600 + Math.floor(Math.random() * 1000),
                    coaches: ['S1', 'B1', 'A1', 'C1']
                });
            }
            filtered = [...filtered, ...dynamicTrains];
        }
        
        filtered.sort((a, b) => a.price - b.price);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/trains/:id', async (req, res) => {
    try {
        const db = await getDb();
        let train = await db.get('SELECT * FROM trains WHERE id = ?', [req.params.id]);
        
        if (train) {
            train.coaches = JSON.parse(train.coaches);
            train.from = train.fromCity;
            train.to = train.toCity;
        } else if (req.params.id.startsWith('D')) {
            train = { 
                id: req.params.id, 
                name: 'Dynamic Express', 
                from: 'Selected Source', 
                to: 'Selected Destination', 
                departure: '09:00', 
                arrival: '18:00', 
                price: 850, 
                coaches: ['S1', 'B1', 'A1'] 
            };
        }
        
        if (!train) return res.status(404).json({ message: 'Train not found' });
        res.json(train);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Booking Routes
app.post('/api/book', async (req, res) => {
    const { userEmail, trainId, coach, seatNumber } = req.body;
    try {
        const db = await getDb();
        const status = 'Confirmed';
        
        const result = await db.run(
            'INSERT INTO bookings (userEmail, trainId, coach, seatNumber, status) VALUES (?, ?, ?, ?, ?)',
            [userEmail, trainId, coach, seatNumber, status]
        );
        
        res.status(201).json({ id: result.lastID, userEmail, trainId, coach, seatNumber, status });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/bookings/:email', async (req, res) => {
    try {
        const db = await getDb();
        const userBookings = await db.all('SELECT * FROM bookings WHERE userEmail = ?', [req.params.email]);
        res.json(userBookings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
