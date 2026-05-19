const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'railswift_secret_key';

app.use(cors());
app.use(bodyParser.json());

// In-memory data store
const users = [];
const bookings = [];

// More diverse mock Train Data
const trains = [
    { id: '101', name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departure: '08:00', arrival: '16:00', price: 1200, coaches: ['B1', 'B2', 'A1'] },
    { id: '102', name: 'Shatabdi Express', from: 'Mumbai', to: 'Pune', departure: '07:30', arrival: '10:30', price: 600, coaches: ['C1', 'C2', 'E1'] },
    { id: '103', name: 'Duronto Express', from: 'Kolkata', to: 'Delhi', departure: '20:00', arrival: '14:00', price: 1500, coaches: ['B1', 'B2', 'B3'] },
    { id: '104', name: 'Tejas Express', from: 'Chennai', to: 'Bangalore', departure: '15:45', arrival: '20:15', price: 900, coaches: ['C1', 'C2'] },
    { id: '105', name: 'Garib Rath', from: 'Delhi', to: 'Mumbai', departure: '10:00', arrival: '22:00', price: 800, coaches: ['G1', 'G2', 'G3'] },
    { id: '106', name: 'Humsafar Express', from: 'Delhi', to: 'Mumbai', departure: '14:00', arrival: '04:00', price: 1100, coaches: ['H1', 'H2'] },
    { id: '107', name: 'Vande Bharat', from: 'Ahmedabad', to: 'Mumbai', departure: '06:00', arrival: '12:00', price: 1400, coaches: ['C1', 'C2', 'C3'] },
    { id: '108', name: 'Deccan Queen', from: 'Mumbai', to: 'Pune', departure: '17:00', arrival: '23:00', price: 550, coaches: ['D1', 'D2'] },
    { id: '109', name: 'Gatiman Express', from: 'Delhi', to: 'Agra', departure: '08:10', arrival: '09:50', price: 750, coaches: ['E1', 'E2'] },
    { id: '110', name: 'Kashi Vishwanath', from: 'Varanasi', to: 'Delhi', departure: '21:00', arrival: '06:00', price: 450, coaches: ['S1', 'S2', 'S3'] },
    { id: '111', name: 'Punjab Mail', from: 'Amritsar', to: 'Delhi', departure: '19:00', arrival: '05:00', price: 650, coaches: ['B1', 'B2'] },
    { id: '112', name: 'Paschim Express', from: 'Delhi', to: 'Chandigarh', departure: '11:00', arrival: '21:00', price: 700, coaches: ['A1', 'A2'] },
    { id: '113', name: 'Coromandel Express', from: 'Kolkata', to: 'Chennai', departure: '15:20', arrival: '17:00', price: 1100, coaches: ['S1', 'S2', 'B1'] },
    { id: '114', name: 'Grand Trunk Express', from: 'Chennai', to: 'Delhi', departure: '22:00', arrival: '06:00', price: 1300, coaches: ['A1', 'B1'] },
    { id: '115', name: 'Sampark Kranti', from: 'Bangalore', to: 'Delhi', departure: '13:00', arrival: '09:00', price: 1400, coaches: ['B1', 'B2'] },
    { id: '116', name: 'Telangana Express', from: 'Hyderabad', to: 'Delhi', departure: '06:00', arrival: '09:00', price: 1250, coaches: ['A1', 'A2'] },
    { id: '117', name: 'Bihar Sampark Kranti', from: 'Patna', to: 'Delhi', departure: '13:00', arrival: '05:00', price: 850, coaches: ['S1', 'S2'] },
    { id: '118', name: 'Poorva Express', from: 'Kolkata', to: 'Patna', departure: '16:00', arrival: '22:00', price: 500, coaches: ['B1', 'B2'] },
];

// Auth Routes
app.post('/api/signup', async (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, name };
    users.push(newUser);
    res.status(201).json({ message: 'User created' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, name: user.name } });
});

// Train Routes
app.get('/api/trains', (req, res) => {
    const { from, to } = req.query;
    let filtered = trains;
    
    if (from && to) {
        filtered = trains.filter(t => 
            t.from.toLowerCase() === from.toLowerCase() && 
            t.to.toLowerCase() === to.toLowerCase()
        );

        // If not enough trains found for this specific route, generate dynamic ones for the demo to ensure at least 5
        if (filtered.length < 5) {
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
    }
    
    // Sort by price to show minimal price differences
    filtered.sort((a, b) => a.price - b.price);
    res.json(filtered);
});

app.get('/api/trains/:id', (req, res) => {
    // Check static list first
    let train = trains.find(t => t.id === req.params.id);
    
    // If not found, it might be a dynamic train from a previous search
    // For the demo, if it starts with 'D', we'll simulate its data
    if (!train && req.params.id.startsWith('D')) {
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
});

// Booking Routes
app.post('/api/book', (req, res) => {
    const { userEmail, trainId, coach, seatNumber } = req.body;
    const booking = { id: Date.now().toString(), userEmail, trainId, coach, seatNumber, status: 'Confirmed' };
    bookings.push(booking);
    res.status(201).json(booking);
});

app.get('/api/bookings/:email', (req, res) => {
    const userBookings = bookings.filter(b => b.userEmail === req.params.email);
    res.json(userBookings);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
