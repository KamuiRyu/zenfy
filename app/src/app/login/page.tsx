"use client";

import LoginHero from "@/components/login/login_hero";
import LoginForm from "@/components/login/login_form";

export default function LoginPage() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-7xl w-full bg-card rounded-3xl shadow-2xl overflow-hidden grid grid-cols-12">
          <div className="col-span-5 bg-card p-12 flex items-center justify-center">
            <div className="w-full max-w-md text-foreground">
              <LoginForm />
            </div>
          </div>

          <div className="col-span-7 flex items-stretch">
            <LoginHero />
          </div>
        </div>
      </div>
  );
}
