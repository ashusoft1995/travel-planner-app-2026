require("dotenv").config({ path: "../.env" });
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Starting Migration to Supabase...");
  const filesToTables = {
    "users.json": "users",
    "trips.json": "trips",
    "travel-requests.json": "travel_requests",
    "contact-messages.json": "contact_messages",
    "notifications.json": "notifications",
    "activity-logs.json": "activity_logs",
    "agent-requests.json": "agent_requests",
    "messages.json": "messages",
    "internal-messages.json": "internal_messages"
  };

  for (const [filename, table] of Object.entries(filesToTables)) {
    const fullPath = path.join(__dirname, "..", filename);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${filename} - File does not exist.`);
      continue;
    }

    try {
      const raw = fs.readFileSync(fullPath, "utf8");
      const data = JSON.parse(raw);
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`Skipping ${filename} - Empty or invalid data.`);
        continue;
      }

      console.log(`Migrating ${data.length} rows to table: ${table}...`);
      
      const { error } = await supabase.from(table).upsert(data, { ignoreDuplicates: false });
      
      if (error) {
        console.error(`Error migrating ${table}:`, error.message);
      } else {
        console.log(`Successfully migrated ${table}!`);
      }
    } catch (e) {
      console.error(`Failed to process ${filename}:`, e.message);
    }
  }
  
  console.log("Migration Complete!");
}

migrate();
