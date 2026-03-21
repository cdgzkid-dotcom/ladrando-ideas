-- Change default to NULL so new rows must specify podcast explicitly
ALTER TABLE scripts ALTER COLUMN podcast DROP DEFAULT;
