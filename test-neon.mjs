import { Pool } from "@neondatabase/serverless";

const connectionString = "postgresql://neondb_owner:npg_rpxWMKE3D4RQ@ep-holy-rice-amt8wal9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  try {
    const pool = new Pool({ connectionString });
    const res = await pool.query('SELECT NOW()');
    console.log("SUCCESS:", res.rows);
  } catch(e) {
    console.error("ERROR:", e);
  }
}

test();
