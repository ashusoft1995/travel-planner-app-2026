const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT                                                                                                                                                                                                                    || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "ethiotravel-dev-secret-change-me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const DEFAULT_ADMIN_USERNAME = "ashu";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ashu19951";
const DEFAULT_ADMIN_EMAIL = "admin@ethiotravel.local";

app.use(cors());
app.use(express.json({ limit: "12mb" }));

const DB_PATH = path.join(__dirname, "trips.json");
const REQ_PATH = path.join(__dirname, "travel-requests.json");
const CONTACT_PATH = path.join(__dirname, "contact-messages.json");
const NOTIF_PATH = path.join(__dirname, "notifications.json");
const DEST_PATH = path.join(__dirname, "destinations.json");
const USERS_PATH = path.join(__dirname, "users.json");
const ACTIVITY_LOG_PATH = path.join(__dirname, "activity-logs.json");
const AGENT_REQ_PATH = path.join(__dirname, "agent-requests.json");
const MESSAGES_PATH = path.join(__dirname, "messages.json");

/* “Database”: JSON files in this folder (no SQLite/Postgres). Open in an editor to inspect:
   - users.json           — registered accounts + seed admin (passwords are bcrypt hashes)
   - trips.json           — itineraries
   - travel-requests.json   — user travel-request forms
   - contact-messages.json  — contact form + replies
   - notifications.json     — in-app notifications
   - destinations.json      — destination catalog for search */

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]", "utf8");
  }
}

function readTrips() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    return list.map((t) => ({
      ...t,
      approvalStatus: t.approvalStatus || "approved",
      approvalNote: t.approvalNote != null ? String(t.approvalNote) : "",
      reviewedAt: t.reviewedAt != null ? t.reviewedAt : null,
    }));
  } catch {
    return [];
  }
}

function writeTrips(trips) {
  fs.writeFileSync(DB_PATH, JSON.stringify(trips, null, 2) + "\n", "utf8");
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}

function ensureReqDb() {
  if (!fs.existsSync(REQ_PATH)) {
    fs.writeFileSync(REQ_PATH, "[]", "utf8");
  }
}

function readTravelRequests() {
  ensureReqDb();
  const raw = fs.readFileSync(REQ_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTravelRequests(rows) {
  fs.writeFileSync(REQ_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

function ensureContactDb() {
  if (!fs.existsSync(CONTACT_PATH)) {
    fs.writeFileSync(CONTACT_PATH, "[]", "utf8");
  }
}

function readContactMessages() {
  ensureContactDb();
  const raw = fs.readFileSync(CONTACT_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    return list.map((row) => ({
      ...row,
      replies: Array.isArray(row.replies) ? row.replies : [],
      status: row.status || "open",
    }));
  } catch {
    return [];
  }
}

function writeContactMessages(rows) {
  fs.writeFileSync(CONTACT_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

function ensureNotifDb() {
  if (!fs.existsSync(NOTIF_PATH)) {
    fs.writeFileSync(NOTIF_PATH, "[]", "utf8");
  }
}

function readNotifications() {
  ensureNotifDb();
  const raw = fs.readFileSync(NOTIF_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNotifications(rows) {
  fs.writeFileSync(NOTIF_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

function appendNotification({ audience, userEmail, type, title, body, meta }) {
  const rows = readNotifications();
  const nowIso = new Date().toISOString();
  const row = {
    id: makeId(),
    audience: audience === "admin" ? "admin" : "user",
    userEmail:
      audience === "user" && userEmail ? String(userEmail).trim().toLowerCase() : "",
    type: String(type || "info"),
    title: String(title || "").slice(0, 200),
    body: String(body || "").slice(0, 2000),
    read: false,
    createdAt: nowIso,
    meta: meta && typeof meta === "object" ? meta : {},
  };
  rows.unshift(row);
  writeNotifications(rows);
  return row;
}

function readDestinationsCatalog() {
  try {
    if (!fs.existsSync(DEST_PATH)) return [];
    const raw = fs.readFileSync(DEST_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function searchDestinationsExternal(q) {
  if (process.env.ALLOW_EXTERNAL_DESTINATIONS !== "1") return [];
  if (typeof fetch !== "function") return [];
  const query = String(q || "").trim();
  if (query.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(
      query
    )}`;
    const r = await fetch(url, {
      headers: { "User-Agent": "EthioTravelPlanner/1.0 (local-dev)" },
    });
    if (!r.ok) return [];
    const data = await r.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      name: item.display_name || item.name || query,
      region: item.type || "",
      country: item.address?.country || "",
      source: "osm",
    }));
  } catch {
    return [];
  }
}

function ensureUsersDb() {
  if (!fs.existsSync(USERS_PATH)) {
    fs.writeFileSync(USERS_PATH, "[]", "utf8");
  }
}

function readUsers() {
  ensureUsersDb();
  const raw = fs.readFileSync(USERS_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2) + "\n", "utf8");
}

function passwordHashMatches(hash, plain) {
  if (typeof hash !== "string" || hash.length < 20) return false;
  try {
    return bcrypt.compareSync(plain, hash);
  } catch {
    return false;
  }
}

/** Ensures default admin exists and password matches DEFAULT_ADMIN_PASSWORD / ADMIN_PASSWORD env. */
function ensureSeedAdmin() {
  const users = readUsers();
  const idx = users.findIndex(
    (u) => String(u.username || "").toLowerCase() === DEFAULT_ADMIN_USERNAME
  );
  const newHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);

  if (idx === -1) {
    users.push({
      id: makeId(),
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      name: "Ashu",
      passwordHash: newHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    writeUsers(users);
    return;
  }

  const u = users[idx];
  if (passwordHashMatches(u.passwordHash, DEFAULT_ADMIN_PASSWORD)) {
    return;
  }

  users[idx] = {
    ...u,
    passwordHash: newHash,
    role: "admin",
    email: u.email || DEFAULT_ADMIN_EMAIL,
  };
  writeUsers(users);
}

ensureSeedAdmin();

function ensureLogDb() {
  if (!fs.existsSync(ACTIVITY_LOG_PATH)) {
    fs.writeFileSync(ACTIVITY_LOG_PATH, "[]", "utf8");
  }
}

function readLogs() {
  ensureLogDb();
  try {
    const raw = fs.readFileSync(ACTIVITY_LOG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLogs(rows) {
  // Keep only last 100 logs to prevent bloat
  const limited = rows.slice(0, 100);
  fs.writeFileSync(ACTIVITY_LOG_PATH, JSON.stringify(limited, null, 2) + "\n", "utf8");
}

function logActivity(req, { type, targetType, targetId, snapshot, message }) {
  const logs = readLogs();
  const entry = {
    id: makeId(),
    userId: req.authUser?.id || "system",
    userEmail: req.authUser?.email || "system",
    type, // 'create', 'update', 'delete', 'undo'
    targetType, // 'trip', 'travel-request', 'contact-message'
    targetId,
    snapshot, // The data BEFORE the change (for update/delete)
    message,
    createdAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  writeLogs(logs);
}

// Agent Requests Helper Functions
function ensureAgentReqDb() {
  if (!fs.existsSync(AGENT_REQ_PATH)) {
    fs.writeFileSync(AGENT_REQ_PATH, "[]", "utf8");
  }
}

function readAgentRequests() {
  ensureAgentReqDb();
  const raw = fs.readFileSync(AGENT_REQ_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAgentRequests(rows) {
  fs.writeFileSync(AGENT_REQ_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

// Messages Helper Functions
function ensureMessagesDb() {
  if (!fs.existsSync(MESSAGES_PATH)) {
    fs.writeFileSync(MESSAGES_PATH, "[]", "utf8");
  }
}

function readMessages() {
  ensureMessagesDb();
  const raw = fs.readFileSync(MESSAGES_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeMessages(rows) {
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify(rows, null, 2) + "\n", "utf8");
}

function toPublicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    username: u.username || null,
    role: u.role || "user",
    status: u.status || "active",
  };
}

function findUserByLogin(identifier) {
  const raw = String(identifier || "").trim();
  if (!raw) return null;
  const users = readUsers();
  if (raw.includes("@")) {
    const e = raw.toLowerCase();
    return users.find((u) => String(u.email || "").toLowerCase() === e) || null;
  }
  const u = raw.toLowerCase();
  return users.find((x) => String(x.username || "").toLowerCase() === u) || null;
}

function findUserById(id) {
  return readUsers().find((x) => x.id === id) || null;
}

function signToken(user) {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware({ optional = false } = {}) {
  return (req, res, next) => {
    const h = req.headers.authorization;
    if (!h || !String(h).startsWith("Bearer ")) {
      if (optional) {
        req.authUser = null;
        return next();
      }
      return res.status(401).json({ message: "Sign in required" });
    }
    const token = String(h).slice(7).trim();
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const u = findUserById(payload.sub);
      if (!u) return res.status(401).json({ message: "Invalid session" });
      req.authUser = {
        id: u.id,
        email: String(u.email || "").toLowerCase(),
        name: u.name,
        role: u.role || "user",
        username: u.username || null,
      };
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired session" });
    }
  };
}

function requireAdmin(req, res, next) {
  if (!req.authUser || req.authUser.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
}

function canAccessTrip(trip, authUser) {
  if (!trip || !authUser) return false;
  if (authUser.role === "admin") return true;
  if (authUser.role === "agent" && trip.assignedAgent === authUser.id) return true;
  return String(trip.ownerEmail || "").toLowerCase() === authUser.email;
}

// ——— Auth ———

app.post("/api/auth/register", (req, res) => {
  const body = req.body || {};
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (name.length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Valid email is required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  let users = readUsers();
  if (users.some((u) => String(u.email || "").toLowerCase() === email)) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const username = String(body.username || "").trim().toLowerCase();
  const reqRole = body.role === "agent" ? "agent" : "user";
  const status = reqRole === "agent" ? "pending" : "active";

  const user = {
    id: makeId(),
    name,
    email,
    username: username || undefined,
    passwordHash: bcrypt.hashSync(password, 10),
    role: reqRole,
    status: status,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);

  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const body = req.body || {};
  const identifier = body.identifier != null ? body.identifier : body.email;
  const password = String(body.password || "");

  const user = findUserByLogin(identifier);
  if (!user || !passwordHashMatches(user.passwordHash, password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

app.get("/api/auth/me", authMiddleware(), (req, res) => {
  const u = findUserById(req.authUser.id);
  if (!u) return res.status(401).json({ message: "Invalid session" });
  res.json({ user: toPublicUser(u) });
});

app.patch("/api/auth/me", authMiddleware(), (req, res) => {
  const users = readUsers();
  const idx = users.findIndex((x) => x.id === req.authUser.id);
  if (idx === -1) {
    return res.status(401).json({ message: "Invalid session" });
  }

  const body = req.body || {};
  const u = { ...users[idx] };
  const currentPassword = body.currentPassword;

  // For any credential change (username or password), verify current password if it exists
  const isCredentialChange = body.username !== undefined || body.password !== undefined;
  if (isCredentialChange) {
    if (!currentPassword || !passwordHashMatches(u.passwordHash, currentPassword)) {
      return res.status(401).json({ message: "Correct current password is required to change credentials" });
    }
  }

  if (body.name !== undefined) {
    const n = String(body.name || "").trim();
    if (n.length < 2) return res.status(400).json({ message: "Name must be at least 2 characters" });
    u.name = n;
  }

  if (body.username !== undefined) {
    const nextUn = String(body.username || "").trim().toLowerCase();
    if (nextUn.length < 2) return res.status(400).json({ message: "Username must be at least 2 characters" });
    if (nextUn !== String(u.username || "").toLowerCase()) {
      const exists = users.some(x => x.id !== u.id && String(x.username || "").toLowerCase() === nextUn);
      if (exists) return res.status(409).json({ message: "This username is already taken" });
      u.username = nextUn;
    }
  }

  if (body.password !== undefined) {
    const nextPw = String(body.password || "");
    if (nextPw.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
    u.passwordHash = bcrypt.hashSync(nextPw, 10);
  }

  users[idx] = u;
  writeUsers(users);
  res.json({ user: toPublicUser(u) });
});

// --- Agent Registration & Management ---

app.post("/api/agent-requests", authMiddleware(), (req, res) => {
  // Users can request to become agents
  if (req.authUser.role !== "user") {
    return res.status(403).json({ message: "Only regular users can request to become agents" });
  }

  const agentRequests = readAgentRequests();
  
  // Check if user already has a pending request
  const existingRequest = agentRequests.find(ar => 
    ar.userId === req.authUser.id && ar.status === "pending"
  );
  if (existingRequest) {
    return res.status(409).json({ message: "You already have a pending agent request" });
  }

  const body = req.body || {};
  const request = {
    id: makeId(),
    userId: req.authUser.id,
    userEmail: req.authUser.email,
    userName: req.authUser.name,
    phone: String(body.phone || "").trim(),
    experience: String(body.experience || "").trim(),
    qualifications: String(body.qualifications || "").trim(),
    bio: String(body.bio || "").trim(),
    profilePhoto: body.profilePhoto || null,
    status: "pending",
    requestedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: null
  };

  agentRequests.push(request);
  writeAgentRequests(agentRequests);

  // Notify admins
  appendNotification({
    audience: "admin",
    type: "agent_request",
    title: "New Agent Application",
    body: `${req.authUser.name} has applied to become an agent.`,
    meta: { requestId: request.id, userId: req.authUser.id }
  });

  logActivity(req, {
    type: "create",
    targetType: "agent-request",
    targetId: request.id,
    message: `Agent request submitted by ${req.authUser.email}`
  });

  res.status(201).json(request);
});

app.get("/api/agent-requests", authMiddleware(), requireAdmin, (req, res) => {
  const agentRequests = readAgentRequests();
  res.json(agentRequests);
});

app.post("/api/agent-requests/:id/approve", authMiddleware(), requireAdmin, (req, res) => {
  const agentRequests = readAgentRequests();
  const requestIdx = agentRequests.findIndex(ar => ar.id === req.params.id);
  if (requestIdx === -1) {
    return res.status(404).json({ message: "Agent request not found" });
  }

  const request = agentRequests[requestIdx];
  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request has already been processed" });
  }

  const users = readUsers();
  const userIdx = users.findIndex(u => u.id === request.userId);
  if (userIdx === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user role to agent
  users[userIdx].role = "agent";
  users[userIdx].agentProfile = {
    phone: request.phone,
    experience: request.experience,
    qualifications: request.qualifications,
    bio: request.bio,
    profilePhoto: request.profilePhoto,
    approvedAt: new Date().toISOString(),
    approvedBy: req.authUser.id
  };

  // Update request status
  request.status = "approved";
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = req.authUser.id;
  request.reviewNote = req.body.note || "Approved";

  writeUsers(users);
  writeAgentRequests(agentRequests);

  // Notify the user
  appendNotification({
    audience: "user",
    userEmail: request.userEmail,
    type: "agent_approved",
    title: "Agent Application Approved",
    body: "Your application to become an agent has been approved! You can now access the agent dashboard.",
    meta: { requestId: request.id }
  });

  logActivity(req, {
    type: "update",
    targetType: "user",
    targetId: request.userId,
    message: `User ${request.userEmail} promoted to agent`
  });

  res.json({ message: "Agent request approved", user: toPublicUser(users[userIdx]) });
});

app.post("/api/agent-requests/:id/reject", authMiddleware(), requireAdmin, (req, res) => {
  const agentRequests = readAgentRequests();
  const requestIdx = agentRequests.findIndex(ar => ar.id === req.params.id);
  if (requestIdx === -1) {
    return res.status(404).json({ message: "Agent request not found" });
  }

  const request = agentRequests[requestIdx];
  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request has already been processed" });
  }

  request.status = "rejected";
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = req.authUser.id;
  request.reviewNote = req.body.note || "Rejected";

  writeAgentRequests(agentRequests);

  // Notify the user
  appendNotification({
    audience: "user",
    userEmail: request.userEmail,
    type: "agent_rejected",
    title: "Agent Application Rejected",
    body: request.reviewNote,
    meta: { requestId: request.id }
  });

  logActivity(req, {
    type: "update",
    targetType: "agent-request",
    targetId: request.id,
    message: `Agent request for ${request.userEmail} rejected`
  });

  res.json({ message: "Agent request rejected" });
});

// ——— User & Agent Management (Admin Only) ———

app.get("/api/users", requireAdmin, (req, res) => {
  const users = readUsers().map(toPublicUser);
  res.json({ users });
});

app.put("/api/users/:id/status", requireAdmin, (req, res) => {
  const users = readUsers();
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });
  
  const oldStatus = users[idx].status;
  users[idx].status = req.body.status || "active";
  writeUsers(users);
  
  logActivity(req, {
     type: "update",
     targetType: "user",
     targetId: users[idx].id,
     snapshot: { ...users[idx], status: oldStatus },
     message: `Updated user ${users[idx].email} status to ${req.body.status}`
  });
  
  res.json({ user: toPublicUser(users[idx]) });
});

// Super Admin User Management
app.post("/api/users/:id/reset-password", authMiddleware(), (req, res) => {
  const isSuperAdmin = req.authUser.username === DEFAULT_ADMIN_USERNAME;
  if (!isSuperAdmin) {
    return res.status(403).json({ message: "Super admin access required" });
  }

  const users = readUsers();
  const userIdx = users.findIndex(u => u.id === req.params.id);
  if (userIdx === -1) return res.status(404).json({ message: "User not found" });
  
  const newPassword = req.body.newPassword;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  users[userIdx].passwordHash = bcrypt.hashSync(newPassword, 10);
  writeUsers(users);

  logActivity(req, {
    type: "update",
    targetType: "user",
    targetId: users[userIdx].id,
    message: `Password reset for user ${users[userIdx].email} by super admin`
  });

  res.json({ message: "Password reset successfully" });
});

app.delete("/api/users/:id", authMiddleware(), (req, res) => {
  const isSuperAdmin = req.authUser.username === DEFAULT_ADMIN_USERNAME;
  if (!isSuperAdmin) {
    return res.status(403).json({ message: "Super admin access required" });
  }

  const users = readUsers();
  const userIdx = users.findIndex(u => u.id === req.params.id);
  if (userIdx === -1) return res.status(404).json({ message: "User not found" });
  
  if (users[userIdx].id === req.authUser.id) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }

  const deletedUser = users[userIdx];
  users.splice(userIdx, 1);
  writeUsers(users);

  logActivity(req, {
    type: "delete",
    targetType: "user",
    targetId: deletedUser.id,
    snapshot: deletedUser,
    message: `User ${deletedUser.email} deleted by super admin`
  });

  res.json({ message: "User deleted successfully" });
});

// ——— Activity & Undo ———

app.get("/api/activity", authMiddleware(), (req, res) => {
  const logs = readLogs();
  if (req.authUser.role === "admin") {
    res.json(logs);
  } else {
    res.json(logs.filter((l) => l.userId === req.authUser.id));
  }
});

app.post("/api/activity/undo/:id", authMiddleware(), (req, res) => {
  const logs = readLogs();
  const logIdx = logs.findIndex((l) => l.id === req.params.id);
  if (logIdx === -1) return res.status(404).json({ message: "Activity log not found" });
  
  const log = logs[logIdx];
  if (req.authUser.role !== "admin" && log.userId !== req.authUser.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    if (log.type === "delete" && log.snapshot) {
      // Re-insert deleted item
      if (log.targetType === "trip") {
        const items = readTrips();
        items.unshift(log.snapshot);
        writeTrips(items);
      } else if (log.targetType === "travel-request") {
        const items = readTravelRequests();
        items.unshift(log.snapshot);
        writeTravelRequests(items);
      } else if (log.targetType === "contact-message") {
        const items = readContactMessages();
        items.unshift(log.snapshot);
        writeContactMessages(items);
      }
    } else if (log.type === "update" && log.snapshot) {
      // Revert edit
      if (log.targetType === "trip") {
        const items = readTrips();
        const i = items.findIndex(x => x.id === log.targetId);
        if (i !== -1) {
          items[i] = log.snapshot;
          writeTrips(items);
        }
      } else if (log.targetType === "travel-request") {
        const items = readTravelRequests();
        const i = items.findIndex(x => x.id === log.targetId);
        if (i !== -1) {
          items[i] = log.snapshot;
          writeTravelRequests(items);
        }
      }
    } else {
      return res.status(400).json({ message: "This action cannot be undone or snapshot is missing" });
    }

    // Remove the log entry or mark it as undone? Let's remove it to keep logs clean OR push a new 'undo' log.
    // Let's remove it.
    logs.splice(logIdx, 1);
    writeLogs(logs);

    res.json({ message: "Action undone successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to undo action: " + err.message });
  }
});

// ——— Destination search (catalog + optional OSM) ———

app.get("/api/destinations/search", async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const limit = Math.min(Number(req.query.limit) || 12, 30);
  if (!q) {
    const catalog = readDestinationsCatalog().slice(0, limit);
    return res.json({ results: catalog, source: "catalog" });
  }

  const catalog = readDestinationsCatalog();
  const local = catalog
    .filter((d) => {
      const name = String(d.name || "").toLowerCase();
      const region = String(d.region || "").toLowerCase();
      const country = String(d.country || "").toLowerCase();
      return name.includes(q) || region.includes(q) || country.includes(q);
    })
    .slice(0, limit)
    .map((d) => ({ ...d, source: "catalog" }));

  let external = [];
  try {
    external = await searchDestinationsExternal(q);
  } catch {
    external = [];
  }

  const seen = new Set(local.map((x) => String(x.name).toLowerCase()));
  const merged = [...local];
  for (const row of external) {
    const key = String(row.name || "").toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(row);
      if (merged.length >= limit) break;
    }
  }

  res.json({ results: merged.slice(0, limit), source: "mixed" });
});

// ——— Notifications ———

app.get("/api/notifications", authMiddleware(), (req, res) => {
  const rows = readNotifications();
  let list;
  if (req.authUser.role === "admin") {
    list = rows.filter((n) => n.audience === "admin");
  } else {
    const e = req.authUser.email;
    list = rows.filter((n) => n.audience === "user" && n.userEmail === e);
  }
  res.json(list);
});

app.patch("/api/notifications/:id/read", authMiddleware(), (req, res) => {
  const rows = readNotifications();
  const idx = rows.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Notification not found" });
  const n = rows[idx];
  if (req.authUser.role === "admin") {
    if (n.audience !== "admin") return res.status(403).json({ message: "Forbidden" });
  } else if (n.audience !== "user" || n.userEmail !== req.authUser.email) {
    return res.status(403).json({ message: "Forbidden" });
  }
  n.read = true;
  rows[idx] = n;
  writeNotifications(rows);
  res.json(n);
});

app.post("/api/notifications/read-all", authMiddleware(), (req, res) => {
  const rows = readNotifications();
  const next = rows.map((n) => {
    if (req.authUser.role === "admin") {
      if (n.audience === "admin") return { ...n, read: true };
      return n;
    }
    if (n.audience === "user" && n.userEmail === req.authUser.email) {
      return { ...n, read: true };
    }
    return n;
  });
  writeNotifications(next);
  res.json({ ok: true });
});

// ——— Trips (authenticated) ———

app.get("/api/trips", authMiddleware(), (req, res) => {
  let trips = readTrips();
  if (req.authUser.role === "admin") {
    const owner = req.query.ownerEmail;
    if (owner !== undefined && String(owner).trim() !== "") {
      const e = String(owner).trim().toLowerCase();
      trips = trips.filter((t) => String(t.ownerEmail || "").toLowerCase() === e);
    }
  } else if (req.authUser.role === "agent") {
    trips = trips.filter(
      (t) => String(t.ownerEmail || "").toLowerCase() === req.authUser.email || t.assignedAgent === req.authUser.id
    );
  } else {
    trips = trips.filter(
      (t) => String(t.ownerEmail || "").toLowerCase() === req.authUser.email
    );
  }
  res.json(trips);
});

app.get("/api/trips/:id", authMiddleware(), (req, res) => {
  const trips = readTrips();
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (!canAccessTrip(trip, req.authUser)) {
    return res.status(403).json({ message: "You cannot access this trip" });
  }
  res.json(trip);
});

app.post("/api/trips", authMiddleware(), (req, res) => {
  const trips = readTrips();
  const nowIso = new Date().toISOString();
  const payload = req.body || {};

  if (!payload.destination || !payload.startDate || !payload.endDate) {
    return res.status(400).json({ message: "destination, startDate, endDate are required" });
  }

  const isAdmin = req.authUser.role === "admin";
  const approvalStatus = isAdmin ? "approved" : "pending";
  const newTrip = {
    id: makeId(),
    ownerEmail: req.authUser.email,
    destination: String(payload.destination).trim(),
    startDate: String(payload.startDate),
    endDate: String(payload.endDate),
    budget: Number(payload.budget) || 0,
    accommodation: payload.accommodation ? String(payload.accommodation) : "",
    activities: Array.isArray(payload.activities) ? payload.activities : [],
    notes: payload.notes ? String(payload.notes) : "",
    image: payload.image ? String(payload.image) : "",
    assignedAgent: null,
    agentStatus: "pending",
    approvalStatus,
    approvalNote: "",
    reviewedAt: isAdmin ? nowIso : null,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  trips.unshift(newTrip);
  writeTrips(trips);

  logActivity(req, {
    type: "create",
    targetType: "trip",
    targetId: newTrip.id,
    message: `Created trip to ${newTrip.destination}`,
  });

  if (!isAdmin) {
    appendNotification({
      audience: "admin",
      userEmail: "",
      type: "trip_pending",
      title: "New trip pending review",
      body: `${req.authUser.email} added “${newTrip.destination}”.`,
      meta: { tripId: newTrip.id, ownerEmail: newTrip.ownerEmail },
    });
  }

  res.status(201).json(newTrip);
});

app.put("/api/trips/:id", authMiddleware(), (req, res) => {
  const trips = readTrips();
  const idx = trips.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Trip not found" });
  if (!canAccessTrip(trips[idx], req.authUser)) {
    return res.status(403).json({ message: "You cannot edit this trip" });
  }

  const existing = trips[idx];
  const isAdmin = req.authUser.role === "admin";
  
  // Log update activity
  logActivity(req, {
    type: "update",
    targetType: "trip",
    targetId: existing.id,
    snapshot: existing,
    message: `Updated trip to ${existing.destination}`,
  });

  const updated = {
    ...existing,
    ownerEmail:
      isAdmin && payload.ownerEmail !== undefined
        ? String(payload.ownerEmail).trim().toLowerCase()
        : existing.ownerEmail,
    destination:
      payload.destination !== undefined ? String(payload.destination).trim() : existing.destination,
    startDate: payload.startDate !== undefined ? String(payload.startDate) : existing.startDate,
    endDate: payload.endDate !== undefined ? String(payload.endDate) : existing.endDate,
    budget: payload.budget !== undefined ? Number(payload.budget) || 0 : existing.budget,
    accommodation:
      payload.accommodation !== undefined ? String(payload.accommodation) : existing.accommodation,
    activities:
      payload.activities !== undefined
        ? Array.isArray(payload.activities)
          ? payload.activities
          : []
        : existing.activities,
    notes: payload.notes !== undefined ? String(payload.notes) : existing.notes,
    image: payload.image !== undefined ? String(payload.image) : existing.image,
    updatedAt: new Date().toISOString(),
  };

  const isAgentAssigned = existing.assignedAgent === req.authUser.id;

  if (isAdmin || isAgentAssigned) {
    if (payload.agentStatus !== undefined) {
      updated.agentStatus = String(payload.agentStatus).trim(); // accepted, declined
    }
  }

  if (!isAdmin) {
    updated.approvalStatus = existing.approvalStatus || "approved";
    updated.approvalNote = existing.approvalNote || "";
    updated.reviewedAt = existing.reviewedAt || null;
    updated.assignedAgent = existing.assignedAgent || null;
  } else {
    if (payload.approvalStatus !== undefined) {
      updated.approvalStatus = String(payload.approvalStatus).trim();
    }
    if (payload.approvalNote !== undefined) {
      updated.approvalNote = String(payload.approvalNote).trim();
    }
    if (payload.assignedAgent !== undefined) {
      updated.assignedAgent = payload.assignedAgent ? String(payload.assignedAgent) : null;
    }
    if (payload.reviewedAt !== undefined) {
      updated.reviewedAt = payload.reviewedAt ? String(payload.reviewedAt) : null;
    }
  }

  trips[idx] = updated;
  writeTrips(trips);
  res.json(updated);
});

app.delete("/api/trips/:id", authMiddleware(), (req, res) => {
  const trips = readTrips();
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (!canAccessTrip(trip, req.authUser)) {
    return res.status(403).json({ message: "You cannot delete this trip" });
  }

  // Log delete activity
  logActivity(req, {
    type: "delete",
    targetType: "trip",
    targetId: trip.id,
    snapshot: trip,
    message: `Deleted trip to ${trip.destination}`,
  });

  const next = trips.filter((t) => t.id !== req.params.id);
  writeTrips(next);
  res.status(204).send();
});

app.patch("/api/trips/:id/approval", authMiddleware(), requireAdmin, (req, res) => {
  const trips = readTrips();
  const idx = trips.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Trip not found" });

  const decision = String(req.body?.decision || "").trim().toLowerCase();
  if (decision !== "approved" && decision !== "rejected") {
    return res.status(400).json({ message: "decision must be approved or rejected" });
  }
  const note = req.body?.note != null ? String(req.body.note).trim() : "";
  const nowIso = new Date().toISOString();
  const trip = trips[idx];
  const updated = {
    ...trip,
    approvalStatus: decision,
    approvalNote: note,
    reviewedAt: nowIso,
    updatedAt: nowIso,
  };
  trips[idx] = updated;
  writeTrips(trips);

  const owner = String(trip.ownerEmail || "").toLowerCase();
  if (owner) {
    appendNotification({
      audience: "user",
      userEmail: owner,
      type: "trip_reviewed",
      title: decision === "approved" ? "Trip approved" : "Trip not approved",
      body:
        decision === "approved"
          ? `Your trip to “${trip.destination}” was approved.`
          : `Your trip to “${trip.destination}” was rejected.${note ? ` Note: ${note}` : ""}`,
      meta: { tripId: trip.id, decision },
    });
  }

  res.json(updated);
});

// ——— Travel requests ———

app.get("/api/travel-requests", authMiddleware(), requireAdmin, (_req, res) => {
  res.json(readTravelRequests());
});

app.get("/api/travel-requests/:id", authMiddleware(), requireAdmin, (req, res) => {
  const rows = readTravelRequests();
  const row = rows.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: "Request not found" });
  res.json(row);
});

app.post("/api/travel-requests", (req, res) => {
  const payload = req.body || {};
  const fullName = String(payload.fullName || "").trim();
  const nationality = String(payload.nationality || "").trim();
  const age = Number(payload.age);
  const gender = String(payload.gender || "").trim();
  const travelHistory = String(payload.travelHistory || "").trim();
  const desiredDestination = String(payload.desiredDestination || "").trim();

  if (!fullName || !nationality || !gender || !travelHistory || !desiredDestination) {
    return res.status(400).json({
      message: "fullName, nationality, gender, travelHistory, and desiredDestination are required",
    });
  }
  if (!Number.isFinite(age) || age < 1 || age > 120) {
    return res.status(400).json({ message: "age must be a number between 1 and 120" });
  }

  const nowIso = new Date().toISOString();
  const row = {
    id: makeId(),
    status: "pending",
    accountEmail: payload.accountEmail ? String(payload.accountEmail).trim() : "",
    fullName,
    email: String(payload.email || "").trim(),
    phone: payload.phone ? String(payload.phone).trim() : "",
    nationality,
    age,
    gender,
    otherStatus: payload.otherStatus ? String(payload.otherStatus).trim() : "",
    maritalOrSocialStatus: payload.maritalOrSocialStatus
      ? String(payload.maritalOrSocialStatus).trim()
      : "",
    passportNumber: payload.passportNumber ? String(payload.passportNumber).trim() : "",
    travelHistory,
    desiredDestination,
    preferredStartDate: payload.preferredStartDate ? String(payload.preferredStartDate) : "",
    preferredEndDate: payload.preferredEndDate ? String(payload.preferredEndDate) : "",
    budgetHint: payload.budgetHint ? String(payload.budgetHint).trim() : "",
    accommodationPreference: payload.accommodationPreference
      ? String(payload.accommodationPreference).trim()
      : "",
    specialRequests: payload.specialRequests ? String(payload.specialRequests).trim() : "",
    profilePhoto: payload.profilePhoto ? String(payload.profilePhoto) : "",
    travelImage: payload.travelImage ? String(payload.travelImage) : "",
    adminNotes: "",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const rows = readTravelRequests();
  rows.unshift(row);
  writeTravelRequests(rows);

  logActivity(req, {
    type: "create",
    targetType: "travel-request",
    targetId: row.id,
    message: `New travel request from ${fullName}`,
  });

  appendNotification({
    audience: "admin",
    userEmail: "",
    type: "travel_request",
    title: "New travel plan request",
    body: `${fullName} → ${desiredDestination}`,
    meta: { requestId: row.id },
  });

  res.status(201).json(row);
});

app.put("/api/travel-requests/:id", authMiddleware(), requireAdmin, (req, res) => {
  const rows = readTravelRequests();
  const idx = rows.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Request not found" });

  const payload = req.body || {};
  const prev = rows[idx];
  
  // Log update activity
  logActivity(req, {
    type: "update",
    targetType: "travel-request",
    targetId: prev.id,
    snapshot: prev,
    message: `Updated travel request for ${prev.fullName}`,
  });

  const merged = {
    ...prev,
    status: payload.status !== undefined ? String(payload.status).trim() : prev.status,
    accountEmail:
      payload.accountEmail !== undefined
        ? String(payload.accountEmail).trim()
        : prev.accountEmail,
    fullName: payload.fullName !== undefined ? String(payload.fullName).trim() : prev.fullName,
    email: payload.email !== undefined ? String(payload.email).trim() : prev.email,
    phone: payload.phone !== undefined ? String(payload.phone).trim() : prev.phone,
    nationality:
      payload.nationality !== undefined ? String(payload.nationality).trim() : prev.nationality,
    age: payload.age !== undefined ? Number(payload.age) : prev.age,
    gender: payload.gender !== undefined ? String(payload.gender).trim() : prev.gender,
    otherStatus:
      payload.otherStatus !== undefined ? String(payload.otherStatus).trim() : prev.otherStatus,
    maritalOrSocialStatus:
      payload.maritalOrSocialStatus !== undefined
        ? String(payload.maritalOrSocialStatus).trim()
        : prev.maritalOrSocialStatus,
    passportNumber:
      payload.passportNumber !== undefined
        ? String(payload.passportNumber).trim()
        : prev.passportNumber,
    travelHistory:
      payload.travelHistory !== undefined ? String(payload.travelHistory).trim() : prev.travelHistory,
    desiredDestination:
      payload.desiredDestination !== undefined
        ? String(payload.desiredDestination).trim()
        : prev.desiredDestination,
    preferredStartDate:
      payload.preferredStartDate !== undefined
        ? String(payload.preferredStartDate)
        : prev.preferredStartDate,
    preferredEndDate:
      payload.preferredEndDate !== undefined
        ? String(payload.preferredEndDate)
        : prev.preferredEndDate,
    budgetHint:
      payload.budgetHint !== undefined ? String(payload.budgetHint).trim() : prev.budgetHint,
    accommodationPreference:
      payload.accommodationPreference !== undefined
        ? String(payload.accommodationPreference).trim()
        : prev.accommodationPreference,
    specialRequests:
      payload.specialRequests !== undefined
        ? String(payload.specialRequests).trim()
        : prev.specialRequests,
    profilePhoto:
      payload.profilePhoto !== undefined ? String(payload.profilePhoto) : prev.profilePhoto,
    travelImage:
      payload.travelImage !== undefined ? String(payload.travelImage) : prev.travelImage,
    adminNotes:
      payload.adminNotes !== undefined ? String(payload.adminNotes).trim() : prev.adminNotes || "",
    updatedAt: new Date().toISOString(),
  };

  if (merged.age !== undefined && (!Number.isFinite(merged.age) || merged.age < 1 || merged.age > 120)) {
    return res.status(400).json({ message: "age must be a number between 1 and 120" });
  }

  rows[idx] = merged;
  writeTravelRequests(rows);
  res.json(merged);
});

app.patch("/api/travel-requests/:id", authMiddleware(), requireAdmin, (req, res) => {
  const rows = readTravelRequests();
  const idx = rows.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Request not found" });

  const patch = req.body || {};
  const prev = rows[idx];

  logActivity(req, {
    type: "update",
    targetType: "travel-request",
    targetId: prev.id,
    snapshot: prev,
    message: `Patched travel request for ${prev.fullName}`,
  });

  const next = {
    ...prev,
    updatedAt: new Date().toISOString(),
  };
  if (patch.status !== undefined) next.status = String(patch.status).trim();
  if (patch.adminNotes !== undefined) next.adminNotes = String(patch.adminNotes).trim();
  rows[idx] = next;
  writeTravelRequests(rows);
  res.json(next);
});

app.delete("/api/travel-requests/:id", authMiddleware(), requireAdmin, (req, res) => {
  const rows = readTravelRequests();
  const row = rows.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: "Request not found" });

  logActivity(req, {
    type: "delete",
    targetType: "travel-request",
    targetId: row.id,
    snapshot: row,
    message: `Deleted travel request from ${row.fullName}`,
  });

  const next = rows.filter((r) => r.id !== req.params.id);
  writeTravelRequests(next);
  res.status(204).send();
});

// ——— Contact messages ———

app.get("/api/contact-messages", authMiddleware(), requireAdmin, (_req, res) => {
  res.json(readContactMessages());
});

app.get("/api/contact-messages/mine", authMiddleware(), (req, res) => {
  const e = req.authUser.email;
  const rows = readContactMessages().filter(
    (row) => String(row.email || "").toLowerCase() === e
  );
  res.json(rows);
});

app.get("/api/contact-messages/mine/:id", authMiddleware(), (req, res) => {
  const e = req.authUser.email;
  const rows = readContactMessages();
  const row = rows.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ message: "Message not found" });
  if (String(row.email || "").toLowerCase() !== e) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json(row);
});

app.post("/api/contact-messages", (req, res) => {
  const payload = req.body || {};
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const message = String(payload.message || "").trim();
  const adminTarget = String(payload.adminTarget || "").trim();
  const otherAdminDetail = String(payload.otherAdminDetail || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: "name, email, and message are required" });
  }
  if (!adminTarget) {
    return res.status(400).json({ message: "adminTarget is required" });
  }
  if (adminTarget === "Other" && !otherAdminDetail) {
    return res
      .status(400)
      .json({ message: "otherAdminDetail is required when adminTarget is Other" });
  }

  const nowIso = new Date().toISOString();
  const row = {
    id: makeId(),
    name,
    email,
    subject: payload.subject ? String(payload.subject).trim() : "",
    message,
    adminTarget,
    otherAdminDetail: adminTarget === "Other" ? otherAdminDetail : "",
    replies: [],
    status: "open",
    createdAt: nowIso,
  };

  const rows = readContactMessages();
  rows.unshift(row);
  writeContactMessages(rows);

  appendNotification({
    audience: "admin",
    userEmail: "",
    type: "contact_inbox",
    title: "New contact / support message",
    body: `${name} <${email}>: ${message.slice(0, 120)}${message.length > 120 ? "…" : ""}`,
    meta: { contactId: row.id },
  });

  res.status(201).json(row);
});

app.post("/api/contact-messages/:id/replies", authMiddleware(), requireAdmin, (req, res) => {
  const body = String(req.body?.body || "").trim();
  if (!body) return res.status(400).json({ message: "body is required" });

  const rows = readContactMessages();
  const idx = rows.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Message not found" });

  const prev = rows[idx];
  const reply = {
    id: makeId(),
    from: "admin",
    authorName: req.authUser.name || "Admin",
    body,
    createdAt: new Date().toISOString(),
  };
  const replies = Array.isArray(prev.replies) ? [...prev.replies, reply] : [reply];
  const updated = {
    ...prev,
    replies,
    status: prev.status || "open",
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = updated;
  writeContactMessages(rows);

  const userEmail = String(prev.email || "").toLowerCase();
  if (userEmail) {
    appendNotification({
      audience: "user",
      userEmail,
      type: "contact_reply",
      title: "Reply from EthioTravel support",
      body: body.slice(0, 200) + (body.length > 200 ? "…" : ""),
      meta: { contactId: prev.id },
    });
  }

  res.status(201).json(updated);
});

// --- Messaging System ---

app.get("/api/messages", authMiddleware(), (req, res) => {
  const messages = readMessages();
  const userRole = req.authUser.role;
  const userId = req.authUser.id;
  
  let filteredMessages = messages;
  
  if (userRole === "admin") {
    // Admins see all messages
    filteredMessages = messages;
  } else if (userRole === "agent") {
    // Agents see group messages and private messages to/from them
    filteredMessages = messages.filter(msg => 
      msg.type === "group" || 
      (msg.type === "private" && (msg.senderId === userId || msg.recipientId === userId))
    );
  } else {
    // Users see group messages and private messages to/from them
    filteredMessages = messages.filter(msg => 
      msg.type === "group" || 
      (msg.type === "private" && (msg.senderId === userId || msg.recipientId === userId))
    );
  }
  
  // Sort by timestamp (newest first)
  filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(filteredMessages);
});

app.post("/api/messages", authMiddleware(), (req, res) => {
  const messages = readMessages();
  const body = req.body || {};
  
  const message = {
    id: makeId(),
    senderId: req.authUser.id,
    senderName: req.authUser.name,
    senderRole: req.authUser.role,
    recipientId: body.recipientId || null,
    recipientName: body.recipientName || null,
    type: body.type || "group", // "group" or "private"
    content: String(body.content || "").trim(),
    contentType: body.contentType || "text", // "text", "image", "file"
    fileData: body.fileData || null, // Base64 data for images/files
    fileName: body.fileName || null,
    edited: false,
    editedAt: null,
    deleted: false,
    deletedAt: null,
    reactions: [], // Array of { userId, emoji }
    replyTo: body.replyTo || null, // ID of message being replied to
    createdAt: new Date().toISOString()
  };
  
  if (!message.content && !message.fileData) {
    return res.status(400).json({ message: "Message content or file is required" });
  }
  
  if (message.type === "private" && !message.recipientId) {
    return res.status(400).json({ message: "Recipient is required for private messages" });
  }
  
  messages.push(message);
  writeMessages(messages);
  
  // Add activity log
  logActivity(req, {
    type: "create",
    targetType: "message",
    targetId: message.id,
    message: `Message sent by ${req.authUser.email}`
  });
  
  res.status(201).json(message);
});

app.put("/api/messages/:id", authMiddleware(), (req, res) => {
  const messages = readMessages();
  const messageIdx = messages.findIndex(m => m.id === req.params.id);
  
  if (messageIdx === -1) {
    return res.status(404).json({ message: "Message not found" });
  }
  
  const message = messages[messageIdx];
  
  // Only sender can edit their own messages
  if (message.senderId !== req.authUser.id) {
    return res.status(403).json({ message: "You can only edit your own messages" });
  }
  
  // Cannot edit deleted messages
  if (message.deleted) {
    return res.status(400).json({ message: "Cannot edit deleted messages" });
  }
  
  const newContent = String(req.body.content || "").trim();
  if (!newContent) {
    return res.status(400).json({ message: "Message content is required" });
  }
  
  // Store original content for undo functionality
  const originalContent = message.content;
  
  message.content = newContent;
  message.edited = true;
  message.editedAt = new Date().toISOString();
  
  writeMessages(messages);
  
  // Log the edit
  logActivity(req, {
    type: "update",
    targetType: "message",
    targetId: message.id,
    snapshot: { ...message, content: originalContent, edited: false },
    message: `Message edited by ${req.authUser.email}`
  });
  
  res.json(message);
});

app.delete("/api/messages/:id", authMiddleware(), (req, res) => {
  const messages = readMessages();
  const messageIdx = messages.findIndex(m => m.id === req.params.id);
  
  if (messageIdx === -1) {
    return res.status(404).json({ message: "Message not found" });
  }
  
  const message = messages[messageIdx];
  
  // Only sender can delete their own messages, admins can delete any
  if (message.senderId !== req.authUser.id && req.authUser.role !== "admin") {
    return res.status(403).json({ message: "You can only delete your own messages" });
  }
  
  // Soft delete
  message.deleted = true;
  message.deletedAt = new Date().toISOString();
  message.content = "[Message deleted]";
  
  writeMessages(messages);
  
  // Log the deletion
  logActivity(req, {
    type: "delete",
    targetType: "message",
    targetId: message.id,
    snapshot: { ...message, deleted: false },
    message: `Message deleted by ${req.authUser.email}`
  });
  
  res.json({ message: "Message deleted successfully" });
});

app.post("/api/messages/:id/react", authMiddleware(), (req, res) => {
  const messages = readMessages();
  const messageIdx = messages.findIndex(m => m.id === req.params.id);
  
  if (messageIdx === -1) {
    return res.status(404).json({ message: "Message not found" });
  }
  
  const message = messages[messageIdx];
  const emoji = String(req.body.emoji || "").trim();
  
  if (!emoji) {
    return res.status(400).json({ message: "Emoji is required" });
  }
  
  // Remove existing reaction from this user
  message.reactions = message.reactions.filter(r => r.userId !== req.authUser.id);
  
  // Add new reaction
  message.reactions.push({
    userId: req.authUser.id,
    userName: req.authUser.name,
    emoji: emoji
  });
  
  writeMessages(messages);
  
  res.json(message.reactions);
});

app.get("/api/messages/online-users", authMiddleware(), (req, res) => {
  // For now, return all active users
  // In a real implementation, this would track actual online status
  const users = readUsers().filter(u => u.status === "active");
  const onlineUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    role: u.role,
    lastSeen: new Date().toISOString() // Mock online status
  }));
  
  res.json(onlineUsers);
});

// Destination management endpoints
app.get("/api/destinations", (req, res) => {
  try {
    const destinations = readDestinationsCatalog();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch destinations" });
  }
});

app.post("/api/destinations", authMiddleware(), requireAdmin, (req, res) => {
  try {
    const destinations = readDestinationsCatalog();
    const newDestination = {
      id: makeId(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    destinations.push(newDestination);
    writeDestinations(destinations);
    
    // Add activity log
    logActivity(req, {
      type: "create",
      targetType: "destination",
      targetId: newDestination.id,
      message: `Destination "${newDestination.name}" created by ${req.authUser.email}`
    });
    
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ message: "Failed to create destination" });
  }
});

app.put("/api/destinations/:id", authMiddleware(), requireAdmin, (req, res) => {
  try {
    const destinations = readDestinationsCatalog();
    const index = destinations.findIndex(d => d.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    const updatedDestination = {
      ...destinations[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    destinations[index] = updatedDestination;
    writeDestinations(destinations);
    
    // Add activity log
    logActivity(req, {
      type: "update",
      targetType: "destination",
      targetId: updatedDestination.id,
      message: `Destination "${updatedDestination.name}" updated by ${req.authUser.email}`
    });
    
    res.json(updatedDestination);
  } catch (error) {
    res.status(500).json({ message: "Failed to update destination" });
  }
});

app.delete("/api/destinations/:id", authMiddleware(), requireAdmin, (req, res) => {
  try {
    const destinations = readDestinationsCatalog();
    const index = destinations.findIndex(d => d.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: "Destination not found" });
    }
    
    const deletedDestination = destinations[index];
    destinations.splice(index, 1);
    writeDestinations(destinations);
    
    // Add activity log
    logActivity(req, {
      type: "delete",
      targetType: "destination",
      targetId: deletedDestination.id,
      snapshot: deletedDestination,
      message: `Destination "${deletedDestination.name}" deleted by ${req.authUser.email}`
    });
    
    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete destination" });
  }
});

// Admin profit data endpoint
app.get("/api/admin/profit-data", authMiddleware(), requireAdmin, (req, res) => {
  try {
    const { range = "month" } = req.query;
    const trips = readTrips();
    const users = readUsers();
    
    // Filter trips based on time range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const filteredTrips = trips.filter(trip => 
      new Date(trip.createdAt) >= startDate && trip.approvalStatus === "approved"
    );
    
    // Calculate profit metrics
    let totalRevenue = 0;
    let totalProfit = 0;
    let adminCommission = 0;
    let agentCommission = 0;
    
    const agentProfits = {};
    const recentTransactions = [];
    
    filteredTrips.forEach(trip => {
      const subtotal = trip.costBreakdown?.subtotal || trip.budget || 0;
      const adminComm = subtotal * 0.03; // 3% admin commission
      const agentComm = subtotal * 0.07; // 7% agent commission
      const profit = subtotal - adminComm - agentComm;
      
      totalRevenue += subtotal;
      totalProfit += profit;
      adminCommission += adminComm;
      agentCommission += agentComm;
      
      // Track agent profits
      if (trip.assignedAgent) {
        if (!agentProfits[trip.assignedAgent]) {
          agentProfits[trip.assignedAgent] = {
            name: users.find(u => u.id === trip.assignedAgent)?.name || "Unknown",
            commission: 0,
            trips: 0
          };
        }
        agentProfits[trip.assignedAgent].commission += agentComm;
        agentProfits[trip.assignedAgent].trips += 1;
      }
      
      // Add to recent transactions
      recentTransactions.push({
        id: trip.id,
        date: trip.createdAt,
        customerName: users.find(u => u.email === trip.ownerEmail)?.name || "Unknown",
        destination: trip.destination,
        total: trip.budget || subtotal,
        agentName: users.find(u => u.id === trip.assignedAgent)?.name || "Unassigned",
        profit: profit
      });
    });
    
    // Sort agents by commission
    const topAgents = Object.values(agentProfits)
      .sort((a, b) => b.commission - a.commission)
      .slice(0, 5);
    
    // Sort recent transactions by date
    recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      totalRevenue,
      totalProfit,
      adminCommission,
      agentCommission,
      totalTrips: filteredTrips.length,
      topAgents,
      recentTransactions: recentTransactions.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profit data" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use — another process (often an old EthioTravel backend) is running.\n` +
        `Close that terminal, or from the project folder run: kill-dev-ports.bat\n`
    );
  } else {
    console.error(err);
  }
  process.exit(1);
});
