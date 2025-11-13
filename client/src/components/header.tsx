import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, UserPlus, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="font-bold text-xl hidden sm:inline">LifeLink</span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/find">
              <Button
                data-testid="nav-find-donors"
                variant={isActive("/find") ? "default" : "ghost"}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Find Donors
              </Button>
            </Link>
            <Link href="/register">
              <Button
                data-testid="nav-register"
                variant={isActive("/register") ? "default" : "ghost"}
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50">
              <div className="flex flex-col text-right">
                <span className="text-xs text-muted-foreground">Emergency Hotline</span>
                <span className="text-sm font-semibold text-primary">1-800-LIFE-NOW</span>
              </div>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button data-testid="button-mobile-menu" variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/find">
                    <Button
                      data-testid="mobile-find-donors"
                      variant={isActive("/find") ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      Find Donors
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      data-testid="mobile-register"
                      variant={isActive("/register") ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Register as Donor
                    </Button>
                  </Link>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Emergency Hotline</p>
                      <p className="text-lg font-bold text-primary">1-800-LIFE-NOW</p>
                      <p className="text-xs text-muted-foreground mt-1">Available 24/7</p>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
