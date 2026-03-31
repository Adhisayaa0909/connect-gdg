import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Events" },
    
    { to: "/admin", label: "Admin" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex gap-0.5">
            <span className="h-5 w-5 rounded-full bg-google-blue" />
            <span className="h-5 w-5 rounded-full bg-google-red" />
            <span className="h-5 w-5 rounded-full bg-google-yellow" />
            <span className="h-5 w-5 rounded-full bg-google-green" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            GDG <span className="text-muted-foreground font-normal">On Campus</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={isActive(link.to) ? "default" : "ghost"}
                size="sm"
                className="rounded-full"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive(link.to) ? "default" : "ghost"}
                  className="w-full justify-start rounded-full"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
