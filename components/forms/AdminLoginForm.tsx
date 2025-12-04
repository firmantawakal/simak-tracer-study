'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export function AdminLoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);

    // Check for error parameters from URL
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to admin dashboard on successful login
        router.push('/admin/dashboard');
        router.refresh(); // Refresh to ensure server-side auth check passes
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="text-center">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-r-2 border-t-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="mt-1"
            placeholder="Masukkan username"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1"
            placeholder="Masukkan password"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Login...' : 'Login'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Login menggunakan akun administrator Universitas Dumai
        </p>
      </div>
    </form>
  );
}