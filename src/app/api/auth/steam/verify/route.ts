// src/app/api/auth/steam/verify/route.ts

import { NextResponse } from 'next/server';
import { verifySteamAssertion } from '@lib/steamAuth';

export async function POST(request: Request) {
  const body = await request.json();
  const params = new URLSearchParams(body.query);

  const steamId = await verifySteamAssertion(params);

  if (steamId) {
    return NextResponse.json({ success: true, steamId });
  } else {
    return NextResponse.json({ success: false, error: 'Verification failed' });
  }
}
