-- Add podcast column to distinguish between projects
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS podcast text DEFAULT 'ladrando-ideas';

-- Add guest_profile column  
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS guest_profile text;

-- Add season_number column
ALTER TABLE scripts ADD COLUMN IF NOT EXISTS season_number int;
