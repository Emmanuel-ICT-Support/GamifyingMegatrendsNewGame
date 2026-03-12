// Copy this file to supabase-config.js and fill in your Supabase project URL and anon key.
// Get them from: Supabase dashboard → Project Settings → API

// eslint-disable-next-line no-unused-vars
const SUPABASE = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnl3c2dweXR6cXpheHFleG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDE4MDcsImV4cCI6MjA4ODUxNzgwN30.CgN--4oHjU60CN9yw-At-RgzVzj3S_dmO6geUjPah6U",
};

// If using from a script that exports for the browser:
if (typeof window === "undefined") {
  module.exports = { SUPABASE };
}
