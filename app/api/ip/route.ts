import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { IpType } from '@/app/lib/definitions';

async function fetchIp() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    const data =
      await sql<IpType>`SELECT * FROM current_ip ORDER BY id DESC LIMIT 1`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ip data.');
  }
}

export async function GET(req: NextRequest) {
  const items = await fetchIp();
  return NextResponse.json(items);
}
