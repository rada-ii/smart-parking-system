"use client";

/**
 * ADMIN LOGIN (/admin/login)
 * ==========================
 *
 * Stranica za prijavu administratora.
 *
 * DEMO PRISTUP:
 * Email: admin@inovatech.rs
 * Password: admin123
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Mail, Lock, Shield, ArrowLeft, Info } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isLoading } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = "Email je obavezan";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Unesite validan email";
    if (!form.password) newErrors.password = "Lozinka je obavezna";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await loginAdmin(form);
    if (result.success) {
      showToast("success", "Dobrodošli nazad!");
      router.push("/admin/dashboard");
    } else {
      showToast("error", result.error || "Greška pri prijavi");
      setErrors({ password: result.error || "Pogrešan email ili lozinka" });
    }
  };

  const fillDemo = () => {
    setForm({ email: "admin@inovatech.rs", password: "admin123" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      <header className="p-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
             bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
             text-gray-700 dark:text-gray-200 font-medium
             hover:border-primary-500 dark:hover:border-primary-400
             hover:bg-primary-50 dark:hover:bg-primary-900/20
             transition-all shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Nazad</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <Logo size="lg" linkTo="/" className="justify-center mb-6" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Administrator
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-slate-700">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Admin prijava
              </h1>
              <p className="text-gray-500 dark:text-gray-300 text-center mb-8">
                Prijavite se na administratorski panel
              </p>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full flex items-center gap-3 p-4 mb-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl text-left hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <Info className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
                    Demo pristup
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-500">
                    Klikni da popuniš demo kredencijale
                  </p>
                </div>
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email adresa"
                  name="email"
                  type="email"
                  placeholder="admin@inovatech.rs"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="w-5 h-5" />}
                />
                <Input
                  label="Lozinka"
                  name="password"
                  type="password"
                  placeholder="Unesite lozinku"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock className="w-5 h-5" />}
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  adminTheme
                >
                  Prijavi se
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nemate admin nalog?{" "}
                  <Link
                    href="/admin/register"
                    className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Registrujte se
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Inova Tech
          </p>
        </div>
      </main>
    </div>
  );
}
