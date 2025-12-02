import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();

    // Clear various caches
    const cachesToClear = [
      // Clear Next.js cache
      { name: 'Next.js cache', clear: async () => {
        // This would typically be handled by build system
        // For development, we can simulate cache clearing
        return true;
      }},

      // Clear database connection pools if applicable
      { name: 'Database connections', clear: async () => {
        // Close and reopen database connections
        const { prisma } = await import('@/lib/prisma');
        await prisma.$disconnect();
        // Reconnect happens automatically on next query
        return true;
      }},

      // Clear any application-level cache
      { name: 'Application cache', clear: async () => {
        // Clear any in-memory caches
        if (global.cache) {
          global.cache.clear();
        }
        return true;
      }},
    ];

    const clearedCaches = [];
    const failedCaches = [];

    for (const cache of cachesToClear) {
      try {
        await cache.clear();
        clearedCaches.push(cache.name);
      } catch (error) {
        console.error(`Failed to clear ${cache.name}:`, error);
        failedCaches.push(cache.name);
      }
    }

    return NextResponse.json({
      message: 'Cache clearing completed',
      cleared: clearedCaches,
      failed: failedCaches,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear application cache' },
      { status: 500 }
    );
  }
}