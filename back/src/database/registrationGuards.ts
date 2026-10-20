import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

// A PostgreSQL trigger that refuses a registration when the event is already full.
// It locks the event row first (FOR UPDATE), so when two people ask for the last place at the
// same moment, the second waits for the first to finish and then sees the event full.
// Payload does not manage triggers. In development this runs on every start (CREATE OR REPLACE is
// safe to repeat); production gets the same trigger from the migration in src/migrations.
export async function addRegistrationGuards(payload: Payload): Promise<void> {
  await payload.db.drizzle.execute(sql`
    CREATE OR REPLACE FUNCTION payload.registrations_check_capacity() RETURNS trigger AS $$
    DECLARE
      places integer;
      taken integer;
    BEGIN
      SELECT capacity INTO places FROM payload.events WHERE id = NEW.event_id FOR UPDATE;
      SELECT count(*) INTO taken FROM payload.registrations WHERE event_id = NEW.event_id;
      IF places IS NOT NULL AND taken >= places THEN
        RAISE EXCEPTION 'EVENT_FULL';
      END IF;
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql
  `)
  await payload.db.drizzle.execute(sql`
    CREATE OR REPLACE TRIGGER registrations_capacity
      BEFORE INSERT ON payload.registrations
      FOR EACH ROW EXECUTE FUNCTION payload.registrations_check_capacity()
  `)
}
