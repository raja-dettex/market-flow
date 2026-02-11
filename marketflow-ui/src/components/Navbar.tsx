import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, Plus, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create-workflow", label: "New workflow", icon: Plus },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
    e.preventDefault();
    if(localStorage.getItem('accessToken') != null) { 
      localStorage.removeItem('accessToken');
    }
    if(localStorage.getItem('userId') != null) { 
      localStorage.removeItem('userId');
    }
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90"
        >
          <Zap className="size-6 text-primary" />
          <span className="hidden sm:inline">MarketFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              variant={location.pathname === to ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="gap-2"
            >
              <Link to={to}>
                <Icon className="size-4" />
                {label}
              </Link>
            </Button>
          ))}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  U
                </span>
                <span className="hidden max-w-24 truncate text-left sm:inline">Profile</span>
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                )}
                sideOffset={6}
                align="end"
              >
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-foreground">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    U
                  </span>
                  <div className="flex flex-col">
                    <span>User</span>
                    <span className="text-xs font-normal text-muted-foreground">user@marketflow.io</span>
                  </div>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <User className="size-4" />
                  <Link to='/profile'>Profile</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Settings className="size-4" />
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOut className="size-4" />
                  <Button onClick={e=> handleSignOut(e)}>Sign out</Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  );
}
