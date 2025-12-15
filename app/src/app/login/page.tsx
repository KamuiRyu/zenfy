"use client";

import LoginHero from "@/components/login/LoginHero";
import LoginForm from "@/components/login/LoginForm";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function LoginPage() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-12">
          <div className="col-span-5 bg-white p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>

          <div className="col-span-7">
            <LoginHero />
          </div>
        </div>
      </div>
  );
}
