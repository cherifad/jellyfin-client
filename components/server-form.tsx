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
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function ServerForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setServerUrl, serverUrl } = useJellyfinStore();
  const [localServerUrl, setLocalServerUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const testServer = async (url: string) => {
    try {
      setError(null);
      setLoading(true);
      await fetch(`${url}/System/Info/Public`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      setServerUrl(url);
      router.push("/auth/login");
    } catch (err) {
      setError("Failed to connect to Jellyfin. Check your server URL.");
      setLoading(false);
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
            Choose the Jellyfin server you want to connect to.
          </CardDescription>
          {error && <CardFooter className="text-red-500">{error}</CardFooter>}
        </CardHeader>
        <CardContent>
          <form
            aria-disabled={loading}
            onSubmit={(e) => {
              e.preventDefault();
              testServer(localServerUrl);
            }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="url">Url of your Jellyfin server</Label>
                  <Input
                    id="url"
                    placeholder="m@example.com"
                    defaultValue={serverUrl || ""}
                    required
                    onChange={(e) => setLocalServerUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <LoaderCircle className="animate-spin mr-2" />}
                  Choisir le serveur
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Your server URL is stored locally and never shared with anyone.
      </div>
    </div>
  );
}
