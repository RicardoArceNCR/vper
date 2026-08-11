import Link from "next/link";
import { Button } from "@ui/components/button";
import { Card } from "@ui/components/card";
import { AlertCircle, Home } from "lucide-react";

// Convención de Next (app/not-found.tsx) en vez del NotFound.tsx + wouter
// original — no hace falta enrutador propio para esto en App Router.
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 shadow-lg">
        <div className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-destructive" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>

          <h2 className="text-xl font-semibold text-foreground/80 mb-4">Page Not Found</h2>

          <p className="text-foreground/60 mb-8 leading-relaxed">
            Sorry, the page you are looking for doesn&apos;t exist.
            <br />
            It may have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default" size="lg" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
