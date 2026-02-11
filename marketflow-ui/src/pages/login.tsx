import React, { useId } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

function Login() {
  const emailId = useId();
  const passwordId = useId();
  const handleSignInWithGoogle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
    //e.preventDefault();
     window.location.href = "http://localhost:8000/auth/google";
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.05),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur md:p-10">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Zap className="size-5" />
              </span>
              MarketFlow
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Build trading workflows with clarity and speed.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Login to manage triggers, automate actions, and monitor every step of your
              market strategy in one focused workspace.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Smart automation</p>
                    <p className="text-xs text-muted-foreground">Rapidly connect triggers and actions.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure access</p>
                    <p className="text-xs text-muted-foreground">Protected sessions with auditability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                Real-time monitoring
              </span>
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                Multi-exchange support
              </span>
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1">
                Team-ready workflows
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to continue building workflows.
                </p>
              </div>
              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
                Beta access
              </span>
            </div>

            <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor={emailId}>Email</Label>
                <Input id={emailId} type="email" placeholder="you@marketflow.io" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={passwordId}>Password</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id={passwordId}
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full">
                Continue
                <ArrowRight className="size-4" />
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={(e) => handleSignInWithGoogle(e)}>
                Continue with Google
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
              <span>New to MarketFlow?</span>
              <Link to="/dashboard" className="text-primary hover:underline">
                Request access
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
