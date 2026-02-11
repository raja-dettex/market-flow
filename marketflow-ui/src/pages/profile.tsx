import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Building2, Mail, Phone, Shield, User2 } from "lucide-react";

function Profile() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account details and security preferences.
            </p>
          </div>
          <Button
            onClick={() => {
              setSaving(true);
              setTimeout(() => setSaving(false), 600);
            }}
            className="sm:w-auto"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User2 className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
                <p className="text-xs text-muted-foreground">
                  Your primary identity for MarketFlow.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" placeholder="Alex Johnson" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="alex@marketflow.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 013-2048" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="Portfolio Manager" />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BadgeCheck className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Current plan</h3>
                  <p className="text-xs text-muted-foreground">Pro workspace</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Workflows</span>
                  <span className="font-medium text-foreground">Unlimited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team seats</span>
                  <span className="font-medium text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Audit history</span>
                  <span className="font-medium text-foreground">365 days</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">Security</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Extra protections for your account.
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2">
                  <Shield className="size-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Google SSO</p>
                    <p className="text-xs text-muted-foreground">Enabled for this account.</p>
                  </div>
                  <button className="text-xs font-medium text-primary">Manage</button>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2">
                  <Mail className="size-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Email alerts</p>
                    <p className="text-xs text-muted-foreground">On for critical events.</p>
                  </div>
                  <button className="text-xs font-medium text-primary">Edit</button>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2">
                  <Phone className="size-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Phone verification</p>
                    <p className="text-xs text-muted-foreground">Not configured.</p>
                  </div>
                  <button className="text-xs font-medium text-primary">Enable</button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Workspace</h3>
                  <p className="text-xs text-muted-foreground">MarketFlow Ops</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                  New York
                </span>
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                  24/7 monitoring
                </span>
                <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                  4 workspaces linked
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Profile;
