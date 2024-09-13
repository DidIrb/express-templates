import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">ExirdJS</h1>
      <p className="text-fd-muted-foreground">
        This is a packages designed to help you build express applications faster, open{' '}
        <Link
          href="/docs"
          className="text-fd-foreground font-semibold underline"
        >
          /docs
        </Link>{' '}
        to see the documentation.
      </p>
    </main>
  );
}
