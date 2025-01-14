"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useJellyfinStore } from "@/store/jellyfinStore";
import { Zap, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { connect, serverUrl } = useJellyfinStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!serverUrl) {
      router.push("/auth/server");
    }
  }, [serverUrl]);

  const handleLogin = async () => {
    try {
      setError(null);
      await connect(serverUrl!, username, password);
      router.push("/");
    } catch (err) {
      setError("Failed to connect to Jellyfin. Check your credentials.");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 relative z-20", className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access your Jellyfin server.
          </CardDescription>
          {error && <CardFooter className="text-red-500">{error}</CardFooter>}
        </CardHeader>
        <CardContent>
          <form
            aria-disabled={loading}
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              handleLogin().finally(() => setLoading(false));
            }}
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" disabled={loading}>
                  <Zap className="size-4" />
                  Login with Quick Connect
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    id="username"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && (
                    <LoaderCircle className="animate-spin size-4 ml-2" />
                  )}
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Not the right server URL?{" "}
                <Link
                  href="/auth/server"
                  className="underline underline-offset-4"
                >
                  Change server URL
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Your password or/and email will not be stored outside of your browser.
      </div>
    </div>
  );
}
