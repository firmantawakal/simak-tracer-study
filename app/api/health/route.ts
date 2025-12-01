import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'Tracer Study API is running',
      timestamp: new Date().toISOString(),
      service: 'Universitas Dumai Tracer Study'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'API health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}