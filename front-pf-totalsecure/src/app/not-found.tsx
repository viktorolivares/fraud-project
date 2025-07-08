import Link from 'next/link'
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-lg px-8 py-10">
        <Ghost className="w-16 h-16 text-red-500 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Página no encontrada</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
          No pudimos encontrar el recurso solicitado.<br />
          Por favor, verifica la URL o regresa al inicio.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white font-semibold shadow hover:bg-red-700 transition-colors"
        >
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
}