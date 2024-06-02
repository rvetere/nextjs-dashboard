import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { ExpensesType } from '@/app/lib/definitions';

export async function GET(req: NextRequest) {
  noStore();
  const ip = req.nextUrl.searchParams.get('d');
  // delete all expenses first
  await sql`DELETE FROM current_ip`;

  const data = await sql<ExpensesType>`
        INSERT INTO current_ip (ip)
        VALUES (${ip})
        RETURNING *`;
  return NextResponse.json(data.rows[0]);
}
