const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function getDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

async function initDb() {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT
    );
    
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userEmail TEXT,
      trainId TEXT,
      coach TEXT,
      seatNumber INTEGER,
      status TEXT
    );
    
    CREATE TABLE IF NOT EXISTS trains (
      id TEXT PRIMARY KEY,
      name TEXT,
      fromCity TEXT,
      toCity TEXT,
      departure TEXT,
      arrival TEXT,
      price INTEGER,
      coaches TEXT
    );
  `);
  
  // Seed trains if empty
  const trainCount = await db.get('SELECT COUNT(*) as count FROM trains');
  if (trainCount.count === 0) {
      const initialTrains = [
            { id: '101', name: 'Rajdhani Express', from: 'Delhi', to: 'Mumbai', departure: '08:00', arrival: '16:00', price: 1200, coaches: JSON.stringify(['B1', 'B2', 'A1']) },
            { id: '102', name: 'Shatabdi Express', from: 'Mumbai', to: 'Pune', departure: '07:30', arrival: '10:30', price: 600, coaches: JSON.stringify(['C1', 'C2', 'E1']) },
            { id: '103', name: 'Duronto Express', from: 'Kolkata', to: 'Delhi', departure: '20:00', arrival: '14:00', price: 1500, coaches: JSON.stringify(['B1', 'B2', 'B3']) },
            { id: '104', name: 'Tejas Express', from: 'Chennai', to: 'Bangalore', departure: '15:45', arrival: '20:15', price: 900, coaches: JSON.stringify(['C1', 'C2']) },
            { id: '105', name: 'Garib Rath', from: 'Delhi', to: 'Mumbai', departure: '10:00', arrival: '22:00', price: 800, coaches: JSON.stringify(['G1', 'G2', 'G3']) },
            { id: '106', name: 'Humsafar Express', from: 'Delhi', to: 'Mumbai', departure: '14:00', arrival: '04:00', price: 1100, coaches: JSON.stringify(['H1', 'H2']) },
            { id: '107', name: 'Vande Bharat', from: 'Ahmedabad', to: 'Mumbai', departure: '06:00', arrival: '12:00', price: 1400, coaches: JSON.stringify(['C1', 'C2', 'C3']) },
            { id: '108', name: 'Deccan Queen', from: 'Mumbai', to: 'Pune', departure: '17:00', arrival: '23:00', price: 550, coaches: JSON.stringify(['D1', 'D2']) },
            { id: '109', name: 'Gatiman Express', from: 'Delhi', to: 'Agra', departure: '08:10', arrival: '09:50', price: 750, coaches: JSON.stringify(['E1', 'E2']) },
            { id: '110', name: 'Kashi Vishwanath', from: 'Varanasi', to: 'Delhi', departure: '21:00', arrival: '06:00', price: 450, coaches: JSON.stringify(['S1', 'S2', 'S3']) },
            { id: '111', name: 'Punjab Mail', from: 'Amritsar', to: 'Delhi', departure: '19:00', arrival: '05:00', price: 650, coaches: JSON.stringify(['B1', 'B2']) },
            { id: '112', name: 'Paschim Express', from: 'Delhi', to: 'Chandigarh', departure: '11:00', arrival: '21:00', price: 700, coaches: JSON.stringify(['A1', 'A2']) },
            { id: '113', name: 'Coromandel Express', from: 'Kolkata', to: 'Chennai', departure: '15:20', arrival: '17:00', price: 1100, coaches: JSON.stringify(['S1', 'S2', 'B1']) },
            { id: '114', name: 'Grand Trunk Express', from: 'Chennai', to: 'Delhi', departure: '22:00', arrival: '06:00', price: 1300, coaches: JSON.stringify(['A1', 'B1']) },
            { id: '115', name: 'Sampark Kranti', from: 'Bangalore', to: 'Delhi', departure: '13:00', arrival: '09:00', price: 1400, coaches: JSON.stringify(['B1', 'B2']) },
            { id: '116', name: 'Telangana Express', from: 'Hyderabad', to: 'Delhi', departure: '06:00', arrival: '09:00', price: 1250, coaches: JSON.stringify(['A1', 'A2']) },
            { id: '117', name: 'Bihar Sampark Kranti', from: 'Patna', to: 'Delhi', departure: '13:00', arrival: '05:00', price: 850, coaches: JSON.stringify(['S1', 'S2']) },
            { id: '118', name: 'Poorva Express', from: 'Kolkata', to: 'Patna', departure: '16:00', arrival: '22:00', price: 500, coaches: JSON.stringify(['B1', 'B2']) }
      ];
      
      for (const t of initialTrains) {
          await db.run(
              `INSERT INTO trains (id, name, fromCity, toCity, departure, arrival, price, coaches) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [t.id, t.name, t.from, t.to, t.departure, t.arrival, t.price, t.coaches]
          );
      }
      console.log('Database initialized with seed train data.');
  }
}

module.exports = { getDb, initDb };
