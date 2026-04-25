import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksrjwuloprorwrszqjfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzcmp3dWxvcHJvcndyc3pxamZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjQ3OTQsImV4cCI6MjA5MjcwMDc5NH0.CXXJO8DOx0A7JqAqSeyxDHw5FQezq4NGEjPnQI6wals';

export const supabase = createClient(supabaseUrl, supabaseKey);
