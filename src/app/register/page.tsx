export const runtime = 'edge';

import Link from 'next/link'
import { register } from '../login/actions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <div className="flex h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <PageContainer title="REGISTER NEW OPERATOR">
          <Card className="p-6">
            <form className="flex flex-col gap-4">
              {error && (
                <div className="p-3 border border-coral/30 bg-coral-soft text-coral rounded text-sm mb-2">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-ink-dim text-sm uppercase tracking-wider" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-panel-recessed border border-border text-ink rounded px-3 py-2 focus:outline-none focus:border-emerald transition-colors"
                  placeholder="operator@farm.local"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-ink-dim text-sm uppercase tracking-wider" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-panel-recessed border border-border text-ink rounded px-3 py-2 focus:outline-none focus:border-emerald transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button formAction={register} className="mt-4" type="submit">
                Register Operator
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-ink-faint border-t border-border pt-4">
              Already initialized?{' '}
              <Link href="/login" className="text-emerald hover:text-emerald-deep transition-colors">
                Log in
              </Link>
            </div>
          </Card>
        </PageContainer>
      </div>
    </div>
  )
}

