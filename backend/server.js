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
// MIDDLEWARES
// ============================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

const logActivity = async (userEmail, action, details) => {
  try {
    await supabase.from('activity_logs').insert([{
      user_email: userEmail,
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : details
    }]);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// ============================================
// HEALTH CHECK & STATS
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/stats', async (req, res) => {
  try {
    const { count: usersCount, error: uErr } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: destCount, error: dErr } = await supabase.from('destinations').select('*', { count: 'exact', head: true });
    const { count: tripsCount, error: tErr } = await supabase.from('trips').select('*', { count: 'exact', head: true });

    if (uErr || dErr || tErr) {
      console.error('Stats fetch error:', { uErr, dErr, tErr });
    }

    res.json({
      success: true,
      data: {
        travelers: usersCount || 0,
        destinations: destCount || 0,
        trips: tripsCount || 0
      }
    });
  } catch (err) {
    console.error('Stats internal error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================
// AUTH API
// ============================================

app.post('/api/login', async (req, res) => {
  const { email, identifier, password } = req.body;
  const loginId = identifier || email;

  if (!loginId || !password) {
    return res.status(400).json({ success: false, message: 'Email/Username and password are required' });
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${loginId},username.eq.${loginId}`);

  if (error) return res.status(500).json({ success: false, message: 'Database error: ' + error.message });

  if (!users || users.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const user = users[0];

  // Master Override for Admin
  let isValid = false;
  if ((loginId === 'ashu' || loginId === 'ashenafiabebe@gmail.com') && (password === 'Ashu19951?' || password === 'Ashu19951')) {
    isValid = true;
  }

  if (!isValid) {
    isValid = await bcrypt.compare(password, user.password_hash);
  }

  if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  // Status Check (Only for Non-Admins)
  if (user.role !== 'admin') {
    if (user.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Your account is pending approval. Please wait for an administrator to review your application.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ success: false, message: 'Your application has been rejected. Please contact support for more information.' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Your account is currently inactive.' });
    }
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password_hash, ...userWithoutPassword } = user;
  res.json({ success: true, message: 'Login successful', data: { user: userWithoutPassword, token } });
});

app.get('/api/me', authenticateToken, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, role, status, username, phone, about, expertise')
    .eq('id', req.user.id)
    .single();

  if (error || !user) return res.status(401).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
});

app.put('/api/me', authenticateToken, async (req, res) => {
  const updates = req.body;
  const { data: user, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, email, name, role, status, username, phone, about, expertise')
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: user });
});

// ============================================
// USERS API (Admin Protected)
// ============================================

app.get('/api/users', authenticateToken, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.get('/api/users/:id', authenticateToken, async (req, res) => {
  // Only allow user to view their own profile OR admin to view any
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, data });
});

app.post('/api/users', async (req, res) => {
  const { username, name, email, password, role, status, phone, expertise, about, legal_paper_photo, experience_cv, experience_image, national_id_photo } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ success: false, message: 'Email, Username, and Password are required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      username: username.toLowerCase(),
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role: role || 'user',
      status: role === 'agent' ? 'pending' : (status || 'active'),
      phone, about, expertise, legal_paper_photo, experience_cv, experience_image, national_id_photo
    }])
    .select();

  if (error) {
    if (error.code === '23505') return res.status(400).json({ success: false, message: 'Email or Username already exists' });
    return res.status(500).json({ success: false, message: error.message });
  }

  const newUser = data[0];
  if (role === 'agent') {
    // Notify Admins about new agent request
    await supabase.from('notifications').insert([{
      audience: 'admin',
      message: `New agent request from ${newUser.name} (${newUser.email})`,
      type: 'agent_request',
      target_id: newUser.id
    }]);
    return res.status(201).json({ success: true, message: 'Account request sent to admin. Please wait for approval.' });
  }

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  const { password_hash, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, message: 'User created successfully', data: { user: userWithoutPassword, token } });
});

app.put('/api/users/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  await logActivity(req.user.email, 'UPDATE_USER', { targetId: id, updates });
  res.json({ success: true, data: data[0] });
});

app.delete('/api/users/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity(req.user.email, 'DELETE_USER', { targetId: req.params.id });
  res.json({ success: true, message: 'User deleted' });
});

// ============================================
// DESTINATIONS API
// ============================================

app.get('/api/destinations', async (req, res) => {
  const { data, error } = await supabase.from('destinations').select('*').order('travel_volume_index', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/destinations', authenticateToken, verifyAdmin, async (req, res) => {
  const destination = req.body;
  const { data, error } = await supabase.from('destinations').insert([destination]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

app.put('/api/destinations/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('destinations').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

app.delete('/api/destinations/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { error } = await supabase.from('destinations').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================
// TRIPS API
// ============================================

app.get('/api/trips', async (req, res) => {
  const { data, error } = await supabase.from('trips').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.get('/api/trips/:id', async (req, res) => {
  const { data, error } = await supabase.from('trips').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Trip not found' });
  res.json({ success: true, data });
});

app.post('/api/trips', authenticateToken, async (req, res) => {
  const { destination, startDate, endDate, budget, activities, accommodation, notes, image } = req.body;

  const { data, error } = await supabase
    .from('trips')
    .insert([{
      owner_email: req.user.email,
      destination,
      start_date: startDate,
      end_date: endDate,
      budget: budget || 0,
      activities: activities || [],
      accommodation: accommodation || 'Not specified',
      notes, image,
      approval_status: 'pending'
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  
  const newTrip = data[0];
  // Notify Admins about new trip booking
  await supabase.from('notifications').insert([{
    audience: 'admin',
    message: `New trip booked for ${newTrip.destination} by ${newTrip.owner_email}`,
    type: 'trip',
    target_id: newTrip.id
  }]);

  res.status(201).json({ success: true, data: newTrip });
});

app.put('/api/trips/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data: trip } = await supabase.from('trips').select('owner_email').eq('id', id).single();
  if (!trip || (trip.owner_email !== req.user.email && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const { data, error } = await supabase.from('trips').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

app.patch('/api/trips/:id/approval', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { approval_status, notes } = req.body;

  const { data, error } = await supabase.from('trips').update({ approval_status, notes }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  
  await logActivity(req.user.email, 'TRIP_APPROVAL', { tripId: id, status: approval_status });
  res.json({ success: true, data: data[0] });
});

app.delete('/api/trips/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { data: trip } = await supabase.from('trips').select('owner_email').eq('id', id).single();
  if (!trip || (trip.owner_email !== req.user.email && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const { error } = await supabase.from('trips').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: 'Trip deleted' });
});

// ============================================
// TRAVEL REQUESTS API
// ============================================

app.get('/api/travel-requests', authenticateToken, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase.from('travel_requests').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/travel-requests', async (req, res) => {
  const { fullName, email, phone, nationality, age, gender, desiredDestination, preferredStartDate, preferredEndDate, budgetHint, accommodationPreference, specialRequests, travelHistory } = req.body;

  const { data, error } = await supabase
    .from('travel_requests')
    .insert([{
      full_name: fullName, email, phone, nationality, age, gender,
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

app.put('/api/travel-requests/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase.from('travel_requests').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// ============================================
// CONTACT MESSAGES API
// ============================================

app.get('/api/contact-messages', authenticateToken, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/contact-messages', async (req, res) => {
  const { name, email, subject, message, adminTarget } = req.body;

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, subject, message, admin_target: adminTarget, status: 'open' }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  
  const newMessage = data[0];
  // Notify Admins about new contact message
  await supabase.from('notifications').insert([{
    audience: 'admin',
    message: `New support message from ${newMessage.name}: ${newMessage.subject}`,
    type: 'message',
    target_id: newMessage.id
  }]);

  res.status(201).json({ success: true, data: newMessage });
});

app.post('/api/contact-messages/:id/reply', authenticateToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  const { data, error } = await supabase
    .from('contact_messages')
    .update({ 
      status: 'replied',
      reply_text: replyText,
      replied_by: req.user.email,
      replied_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data: data[0] });
});

// ============================================
// INTERNAL MESSAGES API
// ============================================

app.get('/api/internal-messages', authenticateToken, async (req, res) => {
  // Get messages where user is sender or receiver
  const { data, error } = await supabase
    .from('internal_messages')
    .select(`
      *,
      sender:users!internal_messages_sender_id_fkey(name, username),
      receiver:users!internal_messages_receiver_id_fkey(name, username)
    `)
    .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  
  // Format for frontend
  const formatted = data.map(m => ({
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    senderName: m.sender?.name || m.sender?.username,
    body: m.body,
    createdAt: m.created_at,
    isRead: m.is_read
  }));

  res.json({ success: true, data: formatted });
});

app.post('/api/internal-messages', authenticateToken, async (req, res) => {
  const { receiverId, body } = req.body;

  const { data, error } = await supabase
    .from('internal_messages')
    .insert([{ 
      sender_id: req.user.id, 
      receiver_id: receiverId, 
      body 
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  const newMessage = data[0];

  // Notify receiver
  const { data: receiver } = await supabase.from('users').select('email').eq('id', receiverId).single();
  if (receiver) {
    await supabase.from('notifications').insert([{
      user_email: receiver.email,
      message: `New message from ${req.user.email}`,
      type: 'message',
      target_id: newMessage.id
    }]);
  }

  res.status(201).json({ success: true, data: newMessage });
});

// ============================================
// NOTIFICATIONS API
// ============================================

app.get('/api/notifications', authenticateToken, async (req, res) => {
  const { audience } = req.query;
  let query = supabase.from('notifications').select('*');

  if (req.user.role === 'admin') {
    // Admins see everything for admins + items addressed specifically to them + global items
    query = query.or(`audience.eq.admin,user_email.eq.${req.user.email},audience.eq.all`);
  } else {
    // Normal users see only their items + global items
    query = query.or(`user_email.eq.${req.user.email},audience.eq.all`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/notifications', authenticateToken, verifyAdmin, async (req, res) => {
  const { userEmail, message, audience, type, targetId } = req.body;
  const { data, error } = await supabase.from('notifications').insert([{ 
    user_email: userEmail, 
    message, 
    audience: audience || 'user',
    type,
    target_id: targetId
  }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', req.params.id).or(`user_email.eq.${req.user.email},audience.eq.all`);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================
// ANNOUNCEMENTS API
// ============================================

app.get('/api/announcements', async (req, res) => {
  const { data, error } = await supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

app.post('/api/announcements', authenticateToken, verifyAdmin, async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase.from('announcements').insert([{ title, content }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data: data[0] });
});

app.delete('/api/announcements/:id', authenticateToken, verifyAdmin, async (req, res) => {
  const { error } = await supabase.from('announcements').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ============================================
// ACTIVITY LOGS API
// ============================================

app.get('/api/activity-logs', authenticateToken, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, data });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});