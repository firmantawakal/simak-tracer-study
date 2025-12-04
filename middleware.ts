import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Temporarily disable middleware authentication
// We'll handle authentication at the page level instead

export function middleware(request: NextRequest) {
  console.log('Middleware - All requests passing through');
  // Just pass through all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: []
};