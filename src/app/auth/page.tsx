'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-sage-100/30 blur-3xl dark:bg-sage-800/20" />
        <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-warm-100/40 blur-3xl dark:bg-warm-800/20" />
      </div>

      <Card className="relative w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-full bg-sage-100 p-3 dark:bg-sage-900/50">
            <Sparkles className="h-6 w-6 text-sage-600 dark:text-sage-400" />
          </div>
          <CardTitle className="text-2xl">
            {mode === 'signin' ? 'Welcome back' : 'Create your nest'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Sign in to continue your storytelling journey'
              : 'Start creating stories for your little one'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Get Started'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => router.push('/auth')}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth?mode=signin')}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}

