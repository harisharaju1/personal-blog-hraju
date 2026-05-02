import { loginAction } from '@/lib/actions/admin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-xl font-semibold">Admin</h1>
      {error && (
        <p className="mb-4 text-sm text-red-500">Invalid email or password.</p>
      )}
      <form action={loginAction} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm">Email</label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm">Password</label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full">Log in</Button>
      </form>
    </main>
  )
}
