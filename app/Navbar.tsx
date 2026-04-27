import { Link, useLocation } from "react-router";

export function Navbar() {
  const location = useLocation();

  const linkBase =
    "relative text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors";
  const activeBase =
    "text-black after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:rounded-full after:bg-pink-500";

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 mr-auto">
          <img
            src="/logo.png"
            alt="PRO Consulting"
            className="h-10 w-auto object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`${linkBase} ${isHome ? activeBase : ""}`}
          >
            Home
          </Link>
          <a href="#about" className={linkBase}>
            About Us
          </a>
          <a
            href="/education"
            className={linkBase}
          >
            Education Services
          </a>
          <a
            href="/immigration"
            className={linkBase}
          >
            Visa Services
          </a>
          <a href="#success" className={linkBase}>
            Success Stories
          </a>
          <a href="#contact" className={linkBase}>
            Contact
          </a>
          <a
            href="#contact"
            className="ml-4 rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-pink-700"
          >
            Free Assessment
          </a>
        </nav>
      </div>
    </header>
  );
}

