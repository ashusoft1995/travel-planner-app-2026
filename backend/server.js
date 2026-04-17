const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ============================================
// LOGIN API
// ============================================

app.post('/api/login', async (req, res) => {
  const { email, identifier, password } = req.body;
  const loginId = identifier || email; // Support both field names

  if (!loginId || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email/Username and password are required'
    });
  }

  // Find user by email OR username
  console.log('--- LOGIN ATTEMPT ---');
  console.log('Identifier:', loginId);

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq."${loginId}",username.eq."${loginId}"`); // Added quotes for safety

  if (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error: ' + error.message
    });
  }

  console.log('Users found:', users?.length || 0);

  if (!users || users.length === 0) {
    console.log('Result: User not found');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const user = users[0];

  // Compare password
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user without password
  const { password_hash, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      token: token
    }
  });
});

// ============================================
// GET CURRENT USER (from token)
// ============================================

app.get('/api/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, status, username')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ============================================
// USERS API
// ============================================

// GET all users
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// GET single user
app.get('/api/users/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data });
});

// POST create user (signup)
app.post('/api/users', async (req, res) => {
  const { id, username, name, email, password, role, status } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ success: false, message: 'Email, Username, and Password are required' });
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: id || crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      username: username.toLowerCase(),
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role: role || 'user',
      status: status || 'active'
    }])
    .select();

  if (error) {
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Email or Username already exists' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }

  const newUser = data[0];

  // Generate JWT token so they are logged in immediately
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Remove password before returning
  const { password_hash, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: userWithoutPassword,
      token: token
    }
  });
});

// PUT update user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, name, email, role, status } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update({ username, name, email, role, status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'User deleted' });
});

// ============================================
// TRIPS API
// ============================================

// GET all trips
app.get('/api/trips', async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// GET single trip
app.get('/api/trips/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Trip not found' });
  res.json({ success: true, data });
});

// POST create trip
app.post('/api/trips', async (req, res) => {
  const { destination, startDate, endDate, budget, activities, ownerEmail, accommodation, notes, image } = req.body;

  const { data, error } = await supabase
    .from('trips')
    .insert([{
      id: Date.now().toString(),
      owner_email: ownerEmail,
      destination,
      start_date: startDate,
      end_date: endDate,
      budget: budget || 0,
      activities: activities || [],
      accommodation: accommodation || 'Not specified',
      notes: notes || '',
      image: image || '',
      approval_status: 'pending'
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

// PUT update trip
app.put('/api/trips/:id', async (req, res) => {
  const { id } = req.params;
  const { destination, startDate, endDate, budget, activities, accommodation, notes, image, approval_status } = req.body;

  const { data, error } = await supabase
    .from('trips')
    .update({
      destination,
      start_date: startDate,
      end_date: endDate,
      budget,
      activities,
      accommodation,
      notes,
      image,
      approval_status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// DELETE trip
app.delete('/api/trips/:id', async (req, res) => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'Trip deleted' });
});

// ============================================
// DESTINATIONS API
// ============================================

// GET all destinations
app.get('/api/destinations', async (req, res) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('travel_volume_index', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// GET single destination
app.get('/api/destinations/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Destination not found' });
  res.json({ success: true, data });
});

// ============================================
// TRAVEL REQUESTS API
// ============================================

// GET all travel requests
app.get('/api/travel-requests', async (req, res) => {
  const { data, error } = await supabase
    .from('travel_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// POST create travel request
app.post('/api/travel-requests', async (req, res) => {
  const { fullName, email, phone, nationality, age, gender, desiredDestination, preferredStartDate, preferredEndDate, budgetHint, accommodationPreference, specialRequests, travelHistory } = req.body;

  const { data, error } = await supabase
    .from('travel_requests')
    .insert([{
      id: `req-${Date.now()}`,
      full_name: fullName,
      email,
      phone,
      nationality,
      age,
      gender,
      desired_destination: desiredDestination,
      preferred_start_date: preferredStartDate,
      preferred_end_date: preferredEndDate,
      budget_hint: budgetHint,
      accommodation_preference: accommodationPreference,
      special_requests: specialRequests,
      travel_history: travelHistory,
      status: 'pending'
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

// PUT update travel request status
app.put('/api/travel-requests/:id', async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const { data, error } = await supabase
    .from('travel_requests')
    .update({ status, admin_notes: adminNotes })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// DELETE travel request
app.delete('/api/travel-requests/:id', async (req, res) => {
  const { error } = await supabase
    .from('travel_requests')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'Travel request deleted' });
});

// ============================================
// CONTACT MESSAGES API
// ============================================

// GET all contact messages
app.get('/api/contact-messages', async (req, res) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// POST create contact message
app.post('/api/contact-messages', async (req, res) => {
  const { name, email, subject, message, adminTarget } = req.body;

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      email,
      subject: subject || '',
      message,
      admin_target: adminTarget || null,
      status: 'open'
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

// ============================================
// NOTIFICATIONS API
// ============================================

// GET notifications
app.get('/api/notifications', async (req, res) => {
  const { userEmail, audience } = req.query;

  let query = supabase.from('notifications').select('*');

  if (audience === 'admin') {
    query = query.eq('audience', 'admin');
  } else if (userEmail) {
    query = query.eq('user_email', userEmail);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// ============================================
// ANNOUNCEMENTS API
// ============================================

// GET all active announcements
app.get('/api/announcements', async (req, res) => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   POST   /api/login`);
  console.log(`   GET    /api/me`);
  console.log(`   GET    /api/users`);
  console.log(`   GET    /api/trips`);
  console.log(`   POST   /api/trips`);
  console.log(`   PUT    /api/trips/:id`);
  console.log(`   DELETE /api/trips/:id`);
  console.log(`   GET    /api/destinations`);
  console.log(`   GET    /api/travel-requests`);
  console.log(`   GET    /api/contact-messages`);
  console.log(`   GET    /api/notifications`);
  console.log(`   GET    /api/announcements`);
});