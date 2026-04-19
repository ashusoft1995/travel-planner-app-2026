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
  console.log("Starting Full Migration to Supabase...");
  
  const filesToTables = [
    { file: "users.json", table: "users" },
    { file: "trips.json", table: "trips" },
    { file: "travel-requests.json", table: "travel_requests" },
    { file: "contact-messages.json", table: "contact_messages" },
    { file: "notifications.json", table: "notifications" },
    { file: "activity-logs.json", table: "activity_logs" },
    { file: "destinations.json", table: "destinations" },
    { file: "announcements.json", table: "announcements" }
  ];

  for (const item of filesToTables) {
    const fullPath = path.join(__dirname, "..", item.file);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${item.file} - File does not exist.`);
      continue;
    }

    try {
      const raw = fs.readFileSync(fullPath, "utf8");
      let data = JSON.parse(raw);
      
      if (!Array.isArray(data)) data = [data];
      if (data.length === 0 || (data.length === 1 && Object.keys(data[0]).length === 0)) {
        console.log(`Skipping ${item.file} - Empty data.`);
        continue;
      }

      // Basic column mapping for common mismatches
      const mappedData = data.map(row => {
        const newRow = { ...row };
        
        // Users
        if (newRow.password) delete newRow.password;
        
        // Trips
        if (newRow.ownerEmail) { newRow.owner_email = newRow.ownerEmail; delete newRow.ownerEmail; }
        if (newRow.startDate) { newRow.start_date = newRow.startDate; delete newRow.startDate; }
        if (newRow.endDate) { newRow.end_date = newRow.endDate; delete newRow.endDate; }
        if (newRow.approvalStatus) { newRow.approval_status = newRow.approvalStatus; delete newRow.approvalStatus; }
        
        // Travel Requests
        if (newRow.fullName) { newRow.full_name = newRow.fullName; delete newRow.fullName; }
        if (newRow.desiredDestination) { newRow.desired_destination = newRow.desiredDestination; delete newRow.desiredDestination; }
        if (newRow.preferredStartDate) { newRow.preferred_start_date = newRow.preferredStartDate; delete newRow.preferredStartDate; }
        if (newRow.preferredEndDate) { newRow.preferred_end_date = newRow.preferredEndDate; delete newRow.preferredEndDate; }
        if (newRow.budgetHint) { newRow.budget_hint = newRow.budgetHint; delete newRow.budgetHint; }
        if (newRow.accommodationPreference) { newRow.accommodation_preference = newRow.accommodationPreference; delete newRow.accommodationPreference; }
        if (newRow.specialRequests) { newRow.special_requests = newRow.specialRequests; delete newRow.specialRequests; }
        if (newRow.travelHistory) { newRow.travel_history = newRow.travelHistory; delete newRow.travelHistory; }
        if (newRow.adminNotes) { newRow.admin_notes = newRow.adminNotes; delete newRow.adminNotes; }

        // Contact Messages
        if (newRow.adminTarget) { newRow.admin_target = newRow.adminTarget; delete newRow.adminTarget; }
        if (newRow.replyText) { newRow.reply_text = newRow.replyText; delete newRow.replyText; }
        if (newRow.repliedBy) { newRow.replied_by = newRow.repliedBy; delete newRow.repliedBy; }
        if (newRow.repliedAt) { newRow.replied_at = newRow.repliedAt; delete newRow.repliedAt; }

        // Notifications
        if (newRow.userEmail) { newRow.user_email = newRow.userEmail; delete newRow.userEmail; }
        
        return newRow;
      });

      console.log(`Migrating ${mappedData.length} rows to table: ${item.table}...`);
      
      // Batch insert/upsert
      const { error } = await supabase.from(item.table).upsert(mappedData);
      
      if (error) {
        console.error(`Error migrating ${item.table}:`, error.message);
        // Fallback: try one by one to see where it fails
        /*
        for (const row of mappedData) {
          const { error: e } = await supabase.from(item.table).upsert([row]);
          if (e) console.error(`Failed row in ${item.table}:`, e.message, row);
        }
        */
      } else {
        console.log(`Successfully migrated ${item.table}!`);
      }
    } catch (e) {
      console.error(`Failed to process ${item.file}:`, e.message);
    }
  }
  
  console.log("Migration Complete!");
}

migrate();
