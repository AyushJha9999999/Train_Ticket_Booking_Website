import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogIn, Train, MapPin, Calendar, ArrowRight, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';

// API Configuration
const API_URL = 'http://localhost:5000/api';

// Indian Cities List
const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Agra', 'Varanasi', 'Amritsar', 'Chandigarh', 'Patna'
];

// Components
const Navbar = ({ user, onLogout }) => (
  <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
      <Train size={32} color="#6366f1" />
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>RailSwift</span>
    </Link>
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      {user ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <span>{user.name}</span>
          </div>
          <button onClick={onLogout} className="btn" style={{ background: 'transparent', color: '#f8fafc', border: '1px solid var(--glass-border)' }}>Logout</button>
        </>
      ) : (
        <Link to="/auth" className="btn btn-primary">
          <LogIn size={20} /> Login
        </Link>
      )}
    </div>
  </nav>
);

const Home = ({ user }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!from || !to || !date || !time) {
      alert('Please select Source, Destination, Date, and Time');
      return;
    }
    navigate(`/trains?from=${from}&to=${to}&date=${date}&time=${time}`);
  };

  return (
    <div className="container" style={{ marginTop: '80px', textAlign: 'center' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}
      >
        Your Journey, <span style={{ color: 'var(--primary)' }}>Redefined.</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '50px' }}
      >
        Select your city and find the most affordable routes instantly.
      </motion.p>
      
      <motion.div 
        className="glass" 
        style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '20px', alignItems: 'end', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Source City</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--primary)', zIndex: 2 }} />
            <select 
              className="input-field" 
              style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }} 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select Source</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Destination City</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--accent)', zIndex: 2 }} />
            <select 
              className="input-field" 
              style={{ paddingLeft: '40px', appearance: 'none', cursor: 'pointer' }} 
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select Destination</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Travel Date</label>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)', zIndex: 2 }} />
            <input className="input-field" style={{ paddingLeft: '40px' }} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Time</label>
          <div style={{ position: 'relative' }}>
            <input className="input-field" style={{ paddingLeft: '15px' }} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '14px 40px', height: '50px' }} onClick={handleSearch}>
          <Search size={20} /> Find Trains
        </button>
      </motion.div>
    </div>
  );
};

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    const body = isLogin ? { email, password } : { email, password, name };
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          navigate('/');
        } else {
          setIsLogin(true);
          alert('Signup successful! Please login.');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass" 
        style={{ padding: '50px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Train size={48} color="var(--primary)" style={{ marginBottom: '15px' }} />
          <h2 style={{ fontSize: '2rem' }}>{isLogin ? 'Welcome Back' : 'Join RailSwift'}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Experience the future of travel booking.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <input className="input-field" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input className="input-field" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '50px', fontSize: '1.1rem' }}>
            {isLogin ? 'Login to Account' : 'Create Account'}
          </button>
        </form>
        <p style={{ marginTop: '25px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create one now' : 'Login here'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

const TrainSelection = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    fetch(`${API_URL}/trains?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => {
        setTrains(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Searching for the best routes...</div>;

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem' }}>Available Trains</h2>
          <p style={{ color: 'var(--text-muted)' }}>Showing results sorted by minimal price difference.</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {trains.length > 0 ? trains.map(train => (
          <motion.div 
            key={train.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01, borderColor: 'var(--primary)' }}
            className="glass train-card" 
            style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{train.name}</h3>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                   <span style={{ color: 'var(--primary)', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>#{train.id}</span>
                   <span style={{ color: 'var(--accent)', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Fastest</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{train.departure}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{train.from}</div>
                </div>
                <div style={{ position: 'relative', width: '100px', height: '2px', background: 'var(--glass-border)' }}>
                   <div style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', top: '-3px', left: '0' }}></div>
                   <div style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', top: '-3px', right: '0' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{train.arrival}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{train.to}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{train.price}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>BEST PRICE</div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate(`/book/${train.id}`)}
                style={{ height: '45px' }}
              >
                Select Seats <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No trains found for this route. Try different states.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CoachSelection = ({ user }) => {
  const { trainId } = useParams();
  const [train, setTrain] = useState(null);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/trains/${trainId}`)
      .then(res => res.json())
      .then(data => {
        setTrain(data);
        setSelectedCoach(data.coaches[0]);
      });
  }, [trainId]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!selectedSeat) return;

    try {
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          trainId: train.id,
          coach: selectedCoach,
          seatNumber: selectedSeat
        })
      });
      if (res.ok) setBooked(true);
    } catch (err) {
      alert('Booking failed');
    }
  };

  if (!train) return null;

  if (booked) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '60px', display: 'inline-block' }}>
          <CheckCircle size={80} color="var(--accent)" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2rem' }}>Ticket Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Your journey on {train.name} is ready.</p>
          <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'left' }}>
             <p><strong>Coach:</strong> {selectedCoach}</p>
             <p><strong>Seat:</strong> {selectedSeat}</p>
             <p><strong>PNR:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '30px', width: '100%' }} onClick={() => navigate('/')}>Return to Search</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        <div>
          <h2 style={{ marginBottom: '25px', fontSize: '1.8rem' }}>Choose Your Spot</h2>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            {train.coaches.map(c => (
              <button 
                key={c}
                className="btn" 
                style={{ 
                  background: selectedCoach === c ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  minWidth: '60px',
                  justifyContent: 'center'
                }}
                onClick={() => setSelectedCoach(c)}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="glass" style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <div className="seat available" style={{ width: '24px', height: '24px' }}></div> Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <div className="seat selected" style={{ width: '24px', height: '24px' }}></div> Your Selection
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <div className="seat booked" style={{ width: '24px', height: '24px' }}></div> Booked
              </div>
            </div>
            
            <div className="coach-grid" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const seatNum = i + 1;
                const isBooked = [5, 12, 18, 22, 35].includes(seatNum);
                return (
                  <motion.div 
                    key={i} 
                    whileTap={{ scale: 0.9 }}
                    className={`seat ${isBooked ? 'booked' : 'available'} ${selectedSeat === seatNum ? 'selected' : ''}`}
                    onClick={() => !isBooked && setSelectedSeat(seatNum)}
                    style={{ width: '45px', height: '45px', fontSize: '1rem', margin: '5px' }}
                  >
                    {seatNum}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div>
          <h2 style={{ marginBottom: '25px', fontSize: '1.8rem' }}>Summary</h2>
          <div className="glass" style={{ padding: '35px' }}>
            <div style={{ marginBottom: '25px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '25px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{train.name}</h3>
              <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                {train.from} <ArrowRight size={14} /> {train.to}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Class / Coach</span>
                <span style={{ fontWeight: 'bold' }}>{selectedCoach}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Seat Number</span>
                <span style={{ fontWeight: 'bold', color: selectedSeat ? 'var(--primary)' : 'inherit' }}>{selectedSeat || 'Select a seat'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Base Fare</span>
                <span style={{ fontWeight: 'bold' }}>₹{train.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Total Payable</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{train.price}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '35px', justifyContent: 'center', height: '55px', fontSize: '1.1rem' }}
              disabled={!selectedSeat}
              onClick={handleBooking}
            >
              <CreditCard size={22} /> Pay & Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Auth Guard
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return null;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth setUser={setUser} />} />
          <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/auth" />} />
          <Route path="/trains" element={user ? <TrainSelection /> : <Navigate to="/auth" />} />
          <Route path="/book/:trainId" element={user ? <CoachSelection user={user} /> : <Navigate to="/auth" />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;
