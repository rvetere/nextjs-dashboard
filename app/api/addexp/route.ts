import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { ExpensesType } from '@/app/lib/definitions';

export async function GET(req: NextRequest) {
  const { total_expenses, carried_over, daily_budget, settings_budget } =
    JSON.parse(req.headers.get('data') || '{}');
  console.log('GET request /api/addexp', {
    total_expenses,
    carried_over,
    daily_budget,
    settings_budget,
  });
  const date = new Date().toISOString().split('T')[0];
  const data = await sql<ExpensesType>`
        INSERT INTO expenses (total_expenses, carried_over, daily_budget, settings_budget, created_at)
        VALUES (${total_expenses}, ${carried_over}, ${daily_budget}, ${settings_budget}, ${date})
        RETURNING *`;
  return NextResponse.json(data.rows[0]);
}
