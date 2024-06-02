import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { ExpensesType } from '@/app/lib/definitions';

async function fetchExpenses() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const data =
      await sql<ExpensesType>`SELECT * FROM expenses ORDER BY id DESC LIMIT 1`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function GET(req: NextRequest) {
  const items = await fetchExpenses();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { total_expenses, carried_over, daily_budget, settings_budget } =
    await req.json();
  const date = new Date().toISOString().split('T')[0];
  const data = await sql<ExpensesType>`
        INSERT INTO expenses (total_expenses, carried_over, daily_budget, settings_budget, created_at)
        VALUES (${total_expenses}, ${carried_over}, ${daily_budget}, ${settings_budget}, ${date})
        RETURNING *`;
  return NextResponse.json(data.rows[0]);
}
