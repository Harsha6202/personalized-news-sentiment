
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/ui-components/Logo';
import { cn } from '@/lib/utils';
import { Home, Newspaper, Settings, LogIn, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: Newspaper },
    { label: 'Preferences', path: '/preferences', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          <Link to="/" className="mr-6">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mx-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover-link',
                  isActive(item.path)
                    ? 'text-foreground after:scale-x-100 after:origin-bottom-left'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div
          className={cn(
            'fixed inset-0 z-40 flex flex-col bg-background pt-16 transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <nav className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center py-3 px-4 rounded-lg transition-colors',
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-accent'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center py-3 px-4 rounded-lg transition-colors text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="mr-3 h-5 w-5" />
              Login
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Logo />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              Personalized news with sentiment analysis. © 2023. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end md:justify-end">
            <nav className="flex gap-4 text-sm font-medium text-muted-foreground">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/preferences" className="hover:underline">Preferences</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
