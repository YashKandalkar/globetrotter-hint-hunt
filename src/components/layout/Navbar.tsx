import { Link } from "react-router-dom";
import { UserMenu } from "../auth/UserMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Globetrotter</span>
            <span className="text-xl font-light">Hint Hunt</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
