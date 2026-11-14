import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Edited by hand: the generated "SET DATA TYPE jsonb" would fail on existing plain texts.
// Instead each text is converted: every paragraph (separated by an empty line) becomes a paragraph
// of the rich text editor (Lexical JSON). `down` turns it back into plain text.

const tables = ['posts', 'projects', 'events'] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION "payload"._plain_to_lexical(body text) RETURNS jsonb AS $$
      SELECT jsonb_build_object('root', jsonb_build_object(
        'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
        'children', coalesce((
          SELECT jsonb_agg(jsonb_build_object(
            'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr', 'textFormat', 0,
            'children', jsonb_build_array(jsonb_build_object(
              'type', 'text', 'text', btrim(p, ' ' || chr(9) || chr(10) || chr(13)),
              'format', 0, 'style', '', 'mode', 'normal', 'detail', 0, 'version', 1))
          ) ORDER BY ord)
          FROM regexp_split_to_table(coalesce(body, ''), '\\n\\s*\\n') WITH ORDINALITY AS parts(p, ord)
          WHERE btrim(p, ' ' || chr(9) || chr(10) || chr(13)) <> ''
        ), '[]'::jsonb)))
    $$ LANGUAGE sql IMMUTABLE
  `)
  for (const table of tables) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "payload"."${table}" ALTER COLUMN "body" SET DATA TYPE jsonb USING "payload"._plain_to_lexical("body")`,
      ),
    )
  }
  await db.execute(sql`DROP FUNCTION "payload"._plain_to_lexical(text)`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION "payload"._lexical_to_plain(doc jsonb) RETURNS varchar AS $$
      SELECT coalesce(string_agg(
        (SELECT string_agg(t #>> '{}', '') FROM jsonb_path_query(block, 'strict $.**.text') AS t),
        chr(10) || chr(10) ORDER BY ord), '')
      FROM jsonb_array_elements(doc -> 'root' -> 'children') WITH ORDINALITY AS blocks(block, ord)
    $$ LANGUAGE sql IMMUTABLE
  `)
  for (const table of tables) {
    await db.execute(
      sql.raw(
        `ALTER TABLE "payload"."${table}" ALTER COLUMN "body" SET DATA TYPE varchar USING "payload"._lexical_to_plain("body")`,
      ),
    )
  }
  await db.execute(sql`DROP FUNCTION "payload"._lexical_to_plain(jsonb)`)
}
