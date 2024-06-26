import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { ExpensesType } from '@/app/lib/definitions';

export async function GET(req: NextRequest) {
  noStore();
  const dataStr = req.nextUrl.searchParams.get('d');
  const received = JSON.parse(dataStr || '{}');
  const { total_expenses, carried_over, daily_budget, settings_budget } =
    received;
  const date = new Date().toISOString();
  // delete all expenses first
  await sql`DELETE FROM expenses`;

  try {
    const data = await sql<ExpensesType>`
          INSERT INTO expenses (total_expenses, carried_over, daily_budget, settings_budget, created_at)
          VALUES (${total_expenses}, ${carried_over}, ${daily_budget}, ${settings_budget}, ${date})
          RETURNING *`;
    return NextResponse.json(data.rows[0]);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
