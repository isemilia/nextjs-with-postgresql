export default function Home() {
  return (
    <main>
      <h1 className="text-lg font-semibold">Links</h1>

      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <a href="/sign-in">Sign in</a>
          </li>
          <li>
            <a href="/sign-up">Sign up</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/private">Authenticated only</a>
          </li>
          <li>
            <a href="/admin">Admin role only</a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
