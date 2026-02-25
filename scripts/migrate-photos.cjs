#!/usr/bin/env node
/**
 * Migrate profile photos from old Lovable Supabase to new Supabase
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Config
const OLD_SUPABASE_URL = 'https://hxsykzhergwulxsayckj.supabase.co';
const NEW_SUPABASE_URL = 'https://fhfqfxzwfxquertemdnc.supabase.co';
const NEW_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnFmeHp3ZnhxdWVydGVtZG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTkwNzI2NCwiZXhwIjoyMDg3NDgzMjY0fQ.KWfuTpU51BDkDweJtSlAdqB_ljaWQlwRkb4YmylzFE8';

// Helper to make requests
function request(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'apikey': NEW_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
        ...headers
      }
    };

    if (body) options.headers['Content-Type'] = 'application/json';

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Download file from URL
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.end();
  });
}

// Upload file to Supabase storage
async function uploadToStorage(bucketName, fileName, buffer, contentType) {
  const url = `${NEW_SUPABASE_URL}/storage/v1/object/${bucketName}/${fileName}`;
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'apikey': NEW_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${NEW_SERVICE_ROLE_KEY}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          reject(new Error(`Upload failed: ${res.statusCode} - ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

async function main() {
  console.log('=== Profile Photo Migration ===\n');

  // 1. Get all user profiles with profile_photo_url
  console.log('1. Fetching user profiles from new Supabase...');
  const profilesRes = await request(`${NEW_SUPABASE_URL}/rest/v1/user_profiles?select=id,email,profile_photo_url`);
  const profiles = profilesRes.data.filter(p => p.profile_photo_url);
  console.log(`   Found ${profiles.length} profiles with photos\n`);

  let migrated = 0;
  let failed = 0;

  for (const profile of profiles) {
    try {
      const oldUrl = profile.profile_photo_url;
      console.log(`\n2. Processing: ${profile.email}`);
      console.log(`   Old URL: ${oldUrl}`);

      // Extract filename from old URL
      const fileName = oldUrl.split('/profile-photos/')[1];
      if (!fileName) {
        console.log(`   ⚠️ Could not extract filename from URL`);
        failed++;
        continue;
      }
      console.log(`   Filename: ${fileName}`);

      // Download from old Supabase
      const oldStorageUrl = `${OLD_SUPABASE_URL}/storage/v1/object/public/profile-photos/${fileName}`;
      console.log(`   Downloading from: ${oldStorageUrl}`);
      
      const imageBuffer = await downloadFile(oldStorageUrl);
      console.log(`   Downloaded ${imageBuffer.length} bytes`);

      // Determine content type
      const ext = path.extname(fileName).toLowerCase();
      const contentType = ext === '.png' ? 'image/png' : 
                         ext === '.jpeg' || ext === '.jpg' ? 'image/jpeg' : 
                         ext === '.gif' ? 'image/gif' : 'application/octet-stream';

      // Upload to new Supabase
      console.log(`   Uploading to new Supabase...`);
      await uploadToStorage('profile-photos', fileName, imageBuffer, contentType);
      console.log(`   ✓ Uploaded`);

      // Generate new URL
      const newUrl = `${NEW_SUPABASE_URL}/storage/v1/object/public/profile-photos/${fileName}`;
      console.log(`   New URL: ${newUrl}`);

      // Update profile
      await request(
        `${NEW_SUPABASE_URL}/rest/v1/user_profiles?id=eq.${profile.id}`,
        'PATCH',
        { profile_photo_url: newUrl }
      );
      console.log(`   ✓ Updated profile`);

      migrated++;
      console.log(`   ✅ Success!`);

    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
