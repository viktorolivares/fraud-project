"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Logo from "@public/logo.png";
import { useState, useEffect } from "react";
import { getYear } from "date-fns";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("victor.olivares@apuestatotal.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const { loginUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setYear(getYear(new Date()));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email, password);
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center mb-4">
                <h1 className="text-2xl font-bold">LOGIN</h1>
                <p className="text-muted-foreground text-balance text-xs">
                  Inicia sesión para acceder a tu cuenta.
                </p>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <a
                  href="#"
                  className="ml-auto text-xs underline-offset-2 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Button type="submit" className="w-full text-white" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Iniciando...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>
          </form>
          <div className="bg-muted hidden md:flex items-center justify-center">
            <Image
              src={Logo}
              alt="Image"
              width={100}
              height={100}
              className="w-28 object-cover dark:invert dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        apuestatotal © {year ?? ""} - [Prevención de Fraude] ❤️
      </div>
    </div>
  );
};

export default Login;
