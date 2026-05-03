const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fixLoginIssue() {
  console.log('🔧 Fixing login issue...');
  
  try {
    // 1. Check if admin user exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .or('username.eq.ashu,email.eq.ashenafiabebe604@gmail.com');
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError);
      return;
    }
    
    console.log('📋 Existing users found:', existingUsers?.length || 0);
    if (existingUsers && existingUsers.length > 0) {
      existingUsers.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
    
    // 2. Generate correct password hash
    const password = 'Ashu19951?';
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('🔐 Generated password hash for "Ashu19951?"');
    
    // 3. Create or update admin user
    const adminUser = {
      id: '1200',
      username: 'ashu',
      name: 'Ashenafi Abebe',
      email: 'ashenafiabebe604@gmail.com',
      password_hash: passwordHash,
      role: 'admin',
      status: 'active',
      phone: '+251911000000',
      about: 'System Administrator'
    };
    
    // Try to update first, then insert if not exists
    const { data: updateResult, error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        role: 'admin',
        status: 'active',
        name: 'Ashenafi Abebe'
      })
      .eq('id', '1200')
      .select();
    
    if (updateError || !updateResult || updateResult.length === 0) {
      console.log('📝 Admin user not found, creating new one...');
      
      // Delete any existing conflicting users first
      await supabase.from('users').delete().or('username.eq.ashu,email.eq.ashenafiabebe604@gmail.com');
      
      // Insert new admin user
      const { data: insertResult, error: insertError } = await supabase
        .from('users')
        .insert([adminUser])
        .select();
      
      if (insertError) {
        console.error('❌ Error creating admin user:', insertError);
        return;
      }
      
      console.log('✅ Admin user created successfully:', insertResult[0]);
    } else {
      console.log('✅ Admin user updated successfully:', updateResult[0]);
    }
    
    // 4. Create sample agent user
    const agentPasswordHash = await bcrypt.hash(password, 10);
    const agentUser = {
      id: '1201',
      username: 'agent_jane',
      name: 'Jane Travel Expert',
      email: 'jane@ethiotravel.com',
      password_hash: agentPasswordHash,
      role: 'agent',
      status: 'active',
      phone: '+251911234567',
      about: 'Experienced travel agent specializing in Ethiopian cultural tours.',
      rating: 4.8
    };
    
    const { error: agentError } = await supabase
      .from('users')
      .upsert([agentUser], { onConflict: 'id' });
    
    if (agentError) {
      console.log('⚠️ Agent user creation failed:', agentError.message);
    } else {
      console.log('✅ Agent user created/updated successfully');
    }
    
    // 5. Create sample regular user
    const userPasswordHash = await bcrypt.hash(password, 10);
    const regularUser = {
      id: '1202',
      username: 'traveler_bob',
      name: 'Bob Explorer',
      email: 'bob@gmail.com',
      password_hash: userPasswordHash,
      role: 'user',
      status: 'active',
      phone: '+251922345678'
    };
    
    const { error: userError } = await supabase
      .from('users')
      .upsert([regularUser], { onConflict: 'id' });
    
    if (userError) {
      console.log('⚠️ Regular user creation failed:', userError.message);
    } else {
      console.log('✅ Regular user created/updated successfully');
    }
    
    // 6. Test login
    console.log('\n🧪 Testing login...');
    const testPassword = 'Ashu19951?';
    
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('*')
      .or('username.eq.ashu,email.eq.ashenafiabebe604@gmail.com');
    
    if (testError) {
      console.error('❌ Test login fetch error:', testError);
      return;
    }
    
    if (testUsers && testUsers.length > 0) {
      const testUser = testUsers[0];
      const isValid = await bcrypt.compare(testPassword, testUser.password_hash);
      console.log(`🔍 Password validation for ${testUser.username}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (isValid) {
        console.log('🎉 Login should work now!');
        console.log('\n📋 Login Credentials:');
        console.log('   Username: ashu');
        console.log('   Email: ashenafiabebe604@gmail.com');
        console.log('   Password: Ashu19951?');
      }
    } else {
      console.log('❌ No test user found');
    }
    
    // 7. Show all users
    console.log('\n👥 All users in database:');
    const { data: allUsers } = await supabase.from('users').select('id, username, email, role, status');
    if (allUsers) {
      allUsers.forEach(user => {
        console.log(`   - ${user.username} (${user.email}) - ${user.role} - ${user.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixLoginIssue().then(() => {
  console.log('\n🏁 Login fix completed!');
  process.exit(0);
}).catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});