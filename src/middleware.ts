import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Получаем текущий путь
  const path = request.nextUrl.pathname;

  // Проверяем, является ли путь админским
  if (path.startsWith('/admin')) {
    // Пропускаем проверку для страницы логина
    if (path === '/admin') {
      return NextResponse.next();
    }

    // Здесь можно добавить проверку токена или сессии
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Если нет токена, редиректим на страницу админ-панели
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Для API запросов добавляем CORS заголовки
  if (path.startsWith('/api')) {
    const origin = request.headers.get('origin') || '*';
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }

  return NextResponse.next();
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}; 