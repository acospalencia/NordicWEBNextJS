"use server";

import { SERVICE_OPTIONS } from "@/lib/contact-options";
import {
  PortalApiError,
  portalApiRequest,
  type PortalApiEnvelope,
} from "@/lib/portal/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{8,15}$/;

export type ContactFormErrors = Partial<
  Record<"nombre" | "correo" | "telefono" | "servicio" | "mensaje", string>
>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: ContactFormErrors;
};

const GENERIC_ERROR_MESSAGE =
  "No pudimos enviar tu mensaje. Intentá de nuevo o escribinos directamente a info@nordictech-corp.com.";

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const servicio = String(formData.get("servicio") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  const errors: ContactFormErrors = {};
  if (!nombre) errors.nombre = "Ingresá tu nombre completo.";
  if (!correo) {
    errors.correo = "Ingresá un correo de contacto.";
  } else if (!EMAIL_RE.test(correo)) {
    errors.correo = "Ingresá un correo válido.";
  }
  if (!telefono) {
    errors.telefono = "Ingresá un teléfono de contacto.";
  } else if (!PHONE_RE.test(telefono)) {
    errors.telefono = "Ingresá un teléfono válido (solo números).";
  }
  if (!servicio || !(SERVICE_OPTIONS as readonly string[]).includes(servicio)) {
    errors.servicio = "Elegí la línea de servicio que te interesa.";
  }
  if (!mensaje) errors.mensaje = "Contanos brevemente qué necesitás.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const projectDetails = [
    `Empresa: ${empresa || "No indicada"}`,
    `Teléfono: ${telefono}`,
    `Línea de servicio: ${servicio}`,
    "",
    mensaje,
  ].join("\n");

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("enviar.php", {
      method: "POST",
      form: {
        nombre,
        email: correo,
        mensaje: projectDetails,
      },
    });

    if (response.status !== "success") {
      console.error("El endpoint PHP rechazó el contacto:", response.message);
      return { status: "error", message: GENERIC_ERROR_MESSAGE };
    }

    return { status: "success" };
  } catch (error) {
    console.error(
      "Contact form PHP send failed:",
      error instanceof PortalApiError ? error.message : error
    );
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }
}
