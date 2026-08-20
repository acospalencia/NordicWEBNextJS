"use client";

import { useActionState } from "react";
import { Loader2, LogIn, UserPlus, KeyRound } from "lucide-react";
import { useFormStatus } from "react-dom";
import {
  loginPortal,
  registerPortal,
  requestPasswordReset,
  resetPortalPassword,
} from "@/app/portal/actions";
import type { PortalActionState } from "@/lib/portal/types";

const INITIAL_STATE: PortalActionState = { status: "idle" };
const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#07111F] px-4 py-3 text-sm text-[#F5F7FA] placeholder:text-[#64748B] focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/25";
const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-[#94A3B8]";

function FormMessage({ state }: { state: PortalActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      role="alert"
      className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
        state.status === "success"
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/25 bg-red-500/10 text-red-300"
      }`}
    >
      {state.message}
    </p>
  );
}

function SubmitButton({ label, icon: Icon }: { label: string; icon: typeof LogIn }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
      {pending ? "Procesando…" : label}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginPortal, INITIAL_STATE);
  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <label className="block">
        <span className={labelClass}>Correo o nombre de usuario</span>
        <input className={inputClass} name="username" required autoComplete="username" />
      </label>
      <label className="block">
        <span className={labelClass}>Contraseña</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>
      <SubmitButton label="Iniciar sesión" icon={LogIn} />
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerPortal, INITIAL_STATE);
  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <label className="block">
        <span className={labelClass}>Nombre completo</span>
        <input className={inputClass} name="nombre" required autoComplete="name" maxLength={120} />
      </label>
      <label className="block">
        <span className={labelClass}>Correo corporativo</span>
        <input className={inputClass} name="email" type="email" required autoComplete="email" />
      </label>
      <label className="block">
        <span className={labelClass}>Contraseña</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      <SubmitButton label="Solicitar acceso" icon={UserPlus} />
    </form>
  );
}

export function RecoveryForms() {
  const [requestState, requestAction] = useActionState(requestPasswordReset, INITIAL_STATE);
  const [resetState, resetAction] = useActionState(resetPortalPassword, INITIAL_STATE);
  return (
    <div className="space-y-8">
      <form action={requestAction} className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-[#F5F7FA]">1. Solicitar código</h2>
          <p className="mt-1 text-xs leading-5 text-[#94A3B8]">
            Enviaremos un código válido durante 15 minutos.
          </p>
        </div>
        <FormMessage state={requestState} />
        <label className="block">
          <span className={labelClass}>Correo registrado</span>
          <input className={inputClass} name="email" type="email" required autoComplete="email" />
        </label>
        <SubmitButton label="Enviar código" icon={KeyRound} />
      </form>

      <form action={resetAction} className="space-y-4 border-t border-white/10 pt-7">
        <div>
          <h2 className="text-sm font-semibold text-[#F5F7FA]">2. Definir nueva contraseña</h2>
        </div>
        <FormMessage state={resetState} />
        <label className="block">
          <span className={labelClass}>Correo registrado</span>
          <input className={inputClass} name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block">
          <span className={labelClass}>Código de seis dígitos</span>
          <input
            className={`${inputClass} font-mono tracking-[0.3em]`}
            name="codigo"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
        </label>
        <label className="block">
          <span className={labelClass}>Nueva contraseña</span>
          <input
            className={inputClass}
            name="nueva_password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>
        <SubmitButton label="Actualizar contraseña" icon={KeyRound} />
      </form>
    </div>
  );
}
