"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Send, Loader2, CircleCheck } from "lucide-react";
import { sendContactMessage, type ContactFormState } from "@/app/actions";
import { SERVICE_OPTIONS } from "@/lib/contact-options";

type FieldName = "nombre" | "correo" | "telefono" | "servicio" | "mensaje";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{8,15}$/;

const FIELD_ORDER: FieldName[] = ["nombre", "correo", "telefono", "servicio", "mensaje"];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#0A1626] px-4 py-3.5 text-sm text-[#F5F7FA] placeholder:text-[#64748B] transition-colors focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30";

const errorInputClass = "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/30";

const INITIAL_STATE: ContactFormState = { status: "idle" };

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  if (name === "nombre" && !trimmed) return "Ingresá tu nombre completo.";
  if (name === "correo") {
    if (!trimmed) return "Ingresá un correo de contacto.";
    if (!EMAIL_RE.test(trimmed)) return "Ingresá un correo válido.";
  }
  if (name === "telefono") {
    if (!trimmed) return "Ingresá un teléfono de contacto.";
    if (!PHONE_RE.test(trimmed)) return "Ingresá un teléfono válido (solo números).";
  }
  if (name === "servicio" && !trimmed) return "Elegí la línea de servicio que te interesa.";
  if (name === "mensaje" && !trimmed) return "Comentanos brevemente qué necesitás.";
  return undefined;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#60A5FA] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Enviando…
        </>
      ) : (
        <>
          Enviar mensaje
          <Send className="size-4" />
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState<Partial<Record<FieldName, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const errors: Partial<Record<FieldName, string>> = { ...clientErrors, ...state.errors };

  function handleBlur(name: FieldName) {
    return (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const error = validateField(name, e.target.value);
      setClientErrors((prev) => ({ ...prev, [name]: error }));
    };
  }

  function handleChange(name: FieldName) {
    return () => {
      if (clientErrors[name]) {
        setClientErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };
  }

  function handlePhoneInput(e: React.FormEvent<HTMLInputElement>) {
    const digitsOnly = e.currentTarget.value.replace(/\D/g, "").slice(0, 15);
    if (digitsOnly !== e.currentTarget.value) {
      e.currentTarget.value = digitsOnly;
    }
  }

  function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Permite teclas de control (Backspace, Tab, flechas, Ctrl/Cmd+C/V, etc.)
    if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
    if (!/\d/.test(e.key)) e.preventDefault();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const nextErrors: Partial<Record<FieldName, string>> = {};

    for (const field of FIELD_ORDER) {
      const value = (form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value ?? "";
      const error = validateField(field, value);
      if (error) nextErrors[field] = error;
    }

    setClientErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      e.preventDefault();
      fieldRefs.current[firstInvalid]?.focus();
    }
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-[#0A1626] p-10 text-center">
        <CircleCheck className="size-10 text-[#16A34A]" strokeWidth={1.5} />
        <h3 className="mt-4 text-base font-semibold text-[#F5F7FA]">Mensaje enviado</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#94A3B8]">
          Gracias por escribirnos. Nuestro equipo técnico te va a responder a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-md border border-[#DC2626]/30 bg-[#DC2626]/10 px-4 py-3 text-sm text-[#F87171]">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="nombre" className="sr-only">
          Nombre completo
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="Nombre completo *"
          ref={(el) => {
            fieldRefs.current.nombre = el;
          }}
          onBlur={handleBlur("nombre")}
          onChange={handleChange("nombre")}
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
          className={`${inputClass} ${errors.nombre ? errorInputClass : ""}`}
        />
        {errors.nombre && (
          <p id="nombre-error" role="alert" className="mt-1.5 text-xs text-[#F87171]">
            {errors.nombre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="correo" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Correo electrónico *"
          ref={(el) => {
            fieldRefs.current.correo = el;
          }}
          onBlur={handleBlur("correo")}
          onChange={handleChange("correo")}
          aria-invalid={Boolean(errors.correo)}
          aria-describedby={errors.correo ? "correo-error" : undefined}
          className={`${inputClass} ${errors.correo ? errorInputClass : ""}`}
        />
        {errors.correo && (
          <p id="correo-error" role="alert" className="mt-1.5 text-xs text-[#F87171]">
            {errors.correo}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="sr-only">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Teléfono *"
            ref={(el) => {
              fieldRefs.current.telefono = el;
            }}
            onKeyDown={handlePhoneKeyDown}
            onInput={handlePhoneInput}
            onBlur={handleBlur("telefono")}
            onChange={handleChange("telefono")}
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={errors.telefono ? "telefono-error" : undefined}
            className={`${inputClass} ${errors.telefono ? errorInputClass : ""}`}
          />
          {errors.telefono && (
            <p id="telefono-error" role="alert" className="mt-1.5 text-xs text-[#F87171]">
              {errors.telefono}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="empresa" className="sr-only">
            Empresa
          </label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            autoComplete="organization"
            placeholder="Empresa"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="servicio" className="sr-only">
          Línea de servicio
        </label>
        <select
          id="servicio"
          name="servicio"
          defaultValue=""
          ref={(el) => {
            fieldRefs.current.servicio = el;
          }}
          onBlur={handleBlur("servicio")}
          onChange={handleChange("servicio")}
          aria-invalid={Boolean(errors.servicio)}
          aria-describedby={errors.servicio ? "servicio-error" : undefined}
          className={`${inputClass} ${errors.servicio ? errorInputClass : ""} [&:has(option:checked[value=""])]:text-[#64748B]`}
        >
          <option value="" disabled>
            Línea de servicio *
          </option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.servicio && (
          <p id="servicio-error" role="alert" className="mt-1.5 text-xs text-[#F87171]">
            {errors.servicio}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mensaje" className="sr-only">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          placeholder="Contanos qué servicio o solución necesitás *"
          ref={(el) => {
            fieldRefs.current.mensaje = el;
          }}
          onBlur={handleBlur("mensaje")}
          onChange={handleChange("mensaje")}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
          className={`resize-none ${inputClass} ${errors.mensaje ? errorInputClass : ""}`}
        />
        {errors.mensaje && (
          <p id="mensaje-error" role="alert" className="mt-1.5 text-xs text-[#F87171]">
            {errors.mensaje}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
