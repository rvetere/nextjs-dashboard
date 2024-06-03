import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { ExpensesType, IpType } from '@/app/lib/definitions';

async function fetchExpenses() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const dataIp =
      await sql<IpType>`SELECT * FROM current_ip ORDER BY id DESC LIMIT 1`;
    const data =
      await sql<ExpensesType>`SELECT * FROM expenses ORDER BY id DESC LIMIT 1`;
    return data.rows.map((row, index) => ({
      ...row,
      ip: dataIp.rows[index]?.ip,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expenses data.');
  }
}

export async function GET(req: NextRequest) {
  const items = await fetchExpenses();
  return NextResponse.json(items);
}
