"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearPortalSession,
  getPortalHome,
  requirePortalActionSession,
  setPortalSession,
} from "@/lib/portal/auth";
import {
  clearPortalApiSession,
  PortalApiError,
  portalApiRequest,
  type PortalApiEnvelope,
} from "@/lib/portal/api";
import { getAdminClientTickets } from "@/lib/portal/data";
import {
  PORTAL_ROLES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type PortalActionState,
  type PortalRole,
  type PortalTicket,
} from "@/lib/portal/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function value(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function positiveInteger(formData: FormData, name: string) {
  const parsed = Number(value(formData, name));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function failure(message: string): PortalActionState {
  return { status: "error", message };
}

function success(message: string): PortalActionState {
  return { status: "success", message };
}

async function stateFromApi(response: PortalApiEnvelope, fallback: string) {
  if (response.status === "success") return success(response.message ?? fallback);
  if (
    response.status === "session_expired" ||
    /sesión|acceso denegado|autenticación/i.test(response.message ?? "")
  ) {
    await Promise.all([clearPortalApiSession(), clearPortalSession()]);
  }
  return failure(response.message ?? "El servicio de Bluehost no pudo completar la solicitud.");
}

function apiFailure(error: unknown) {
  console.error("Portal API:", error);
  return failure(
    error instanceof PortalApiError
      ? error.message
      : "No fue posible contactar el servicio del portal."
  );
}

export async function loginPortal(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const username = value(formData, "username");
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return failure("Ingresá tu usuario y contraseña.");

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("login.php", {
      method: "POST",
      form: { username, password },
      captureSession: true,
    });
    if (response.status !== "success") {
      return failure(response.message ?? "Las credenciales introducidas son incorrectas.");
    }

    const role = Number(response.id_rol) as PortalRole;
    if (![1, 2, 3].includes(role)) return failure("La cuenta no tiene un rol válido.");
    await setPortalSession({ userId: 0, name: username, role });
    redirect(getPortalHome(role));
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return apiFailure(error);
  }
}

export async function registerPortal(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const name = value(formData, "nombre");
  const email = value(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (name.length < 3 || name.length > 120) return failure("Ingresá tu nombre completo.");
  if (!EMAIL_RE.test(email) || email.length > 190) return failure("Ingresá un correo válido.");
  if (password.length < 8) return failure("La contraseña debe tener al menos 8 caracteres.");

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("signin.php", {
      method: "POST",
      form: { nombre: name, email, password },
    });
    return stateFromApi(response, "Solicitud enviada. Podrás ingresar cuando soporte apruebe tu cuenta.");
  } catch (error) {
    return apiFailure(error);
  }
}

export async function requestPasswordReset(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const email = value(formData, "email").toLowerCase();
  if (!EMAIL_RE.test(email)) return failure("Ingresá un correo electrónico válido.");
  try {
    const response = await portalApiRequest<PortalApiEnvelope>("solicitar_codigo.php", {
      method: "POST",
      form: { email },
    });
    return stateFromApi(response, "El código fue enviado a tu correo.");
  } catch (error) {
    return apiFailure(error);
  }
}

export async function resetPortalPassword(
  _previousState: PortalActionState,
  formData: FormData
): Promise<PortalActionState> {
  const email = value(formData, "email").toLowerCase();
  const code = value(formData, "codigo");
  const password = String(formData.get("nueva_password") ?? "");
  if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code) || password.length < 8) {
    return failure("Completá el correo, el código de seis dígitos y una contraseña de al menos 8 caracteres.");
  }
  try {
    const response = await portalApiRequest<PortalApiEnvelope>("cambiar_password.php", {
      method: "POST",
      form: { email, codigo: code, nueva_password: password },
    });
    return stateFromApi(response, "Contraseña actualizada. Ya podés iniciar sesión.");
  } catch (error) {
    return apiFailure(error);
  }
}

export async function logoutPortal() {
  try {
    await portalApiRequest<PortalApiEnvelope>("logout.php");
  } catch (error) {
    console.error("No se pudo cerrar la sesión remota:", error);
  }
  await Promise.all([clearPortalApiSession(), clearPortalSession()]);
  redirect("/portal/iniciar-sesion");
}

export async function createPortalTicket(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.CLIENT]);
  if (!session) return failure("La sesión expiró. Iniciá sesión nuevamente.");
  const title = value(formData, "titulo");
  const description = value(formData, "descripcion");
  const priority = value(formData, "prioridad");
  const category = value(formData, "categoria");
  const otherCategory = value(formData, "otra_categoria").replace(/\s+/g, " ");

  if (title.length < 4 || title.length > 160 || description.length < 10) {
    return failure("Ingresá un título y una descripción técnica completa.");
  }
  if (!TICKET_PRIORITIES.includes(priority as (typeof TICKET_PRIORITIES)[number])) {
    return failure("Seleccioná una prioridad válida.");
  }
  if (!TICKET_CATEGORIES.includes(category as (typeof TICKET_CATEGORIES)[number])) {
    return failure("Seleccioná una categoría válida.");
  }
  if (category === "Otro" && (!otherCategory || otherCategory.length > 120)) {
    return failure("Especificá la categoría en un máximo de 120 caracteres.");
  }

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("crear_ticket.php", {
      method: "POST",
      form: {
        titulo: title,
        descripcion: description,
        prioridad: priority,
        categoria: category,
        otra_categoria: category === "Otro" ? otherCategory : "",
      },
    });
    const state = await stateFromApi(response, "Ticket creado correctamente.");
    if (state.status === "success") revalidatePath("/portal");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function closeTicketAsClient(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.CLIENT]);
  if (!session) return failure("La sesión expiró. Iniciá sesión nuevamente.");
  const ticketId = positiveInteger(formData, "id_ticket");
  if (!ticketId) return failure("El ticket seleccionado no es válido.");

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("procesar_ticket_admin.php", {
      method: "POST",
      form: {
        action: "client_close",
        id_ticket: ticketId,
        estado: "Cerrado",
      },
    });
    const state = await stateFromApi(response, "El ticket fue cerrado correctamente.");
    if (state.status === "success") revalidatePath("/portal");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function createTicketAsAdmin(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session) return failure("La sesión expiró o no tiene permisos administrativos.");

  const clientId = positiveInteger(formData, "id_usuario_cliente");
  const title = value(formData, "titulo");
  const description = value(formData, "descripcion");
  const priority = value(formData, "prioridad");
  const category = value(formData, "categoria");
  const otherCategory = value(formData, "otra_categoria").replace(/\s+/g, " ");

  if (!clientId) return failure("Seleccioná el cliente al que se asignará el ticket.");
  if (title.length < 4 || title.length > 160 || description.length < 10) {
    return failure("Ingresá un título y una descripción técnica completa.");
  }
  if (!TICKET_PRIORITIES.includes(priority as (typeof TICKET_PRIORITIES)[number])) {
    return failure("Seleccioná una prioridad válida.");
  }
  if (!TICKET_CATEGORIES.includes(category as (typeof TICKET_CATEGORIES)[number])) {
    return failure("Seleccioná una categoría válida.");
  }
  if (category === "Otro" && (!otherCategory || otherCategory.length > 120)) {
    return failure("Especificá la categoría en un máximo de 120 caracteres.");
  }

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("crear_ticket.php", {
      method: "POST",
      form: {
        id_usuario_cliente: clientId,
        titulo: title,
        descripcion: description,
        prioridad: priority,
        categoria: category,
        otra_categoria: category === "Otro" ? otherCategory : "",
      },
    });
    const state = await stateFromApi(
      response,
      "Ticket abierto correctamente. El cliente recibirá una notificación por correo."
    );
    if (state.status === "success") revalidatePath("/portal/administracion");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function updateTicketAsTechnician(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.TECHNICIAN]);
  if (!session) return failure("La sesión expiró o no tiene permisos técnicos.");
  const ticketId = positiveInteger(formData, "id_ticket");
  const action = value(formData, "accion");
  const comment = value(formData, "comentario");
  if (!ticketId || !["avance", "resolver", "cerrar"].includes(action) || !comment) {
    return failure("Ingresá el detalle de la actividad técnica.");
  }

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("guardar_bitacora_tecnico.php", {
      method: "POST",
      json: { id_ticket: ticketId, accion: action, comentario: comment, enviar_correo: 1 },
    });
    const state = await stateFromApi(response, "Actividad registrada correctamente.");
    if (state.status === "success") revalidatePath("/portal/tecnico");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getAdminTicketsForClient(
  clientId: number
): Promise<{ status: "success" | "error"; message?: string; tickets: PortalTicket[] }> {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session || !Number.isInteger(clientId) || clientId <= 0) {
    return { status: "error", message: "Acceso denegado o cliente inválido.", tickets: [] };
  }
  try {
    return { status: "success", tickets: await getAdminClientTickets(clientId) };
  } catch (error) {
    const state = apiFailure(error);
    return { status: "error", message: state.message, tickets: [] };
  }
}

export async function assignTechnician(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session) return failure("La sesión expiró o no tiene permisos administrativos.");
  const ticketId = positiveInteger(formData, "id_ticket");
  const technicianId = positiveInteger(formData, "id_tecnico");
  const technicianNotes = value(formData, "notas_tecnico");
  const clientComment = value(formData, "comentario_cliente");
  if (!ticketId || !technicianId || !technicianNotes || !clientComment) {
    return failure("Seleccioná un técnico y completá ambas notas de asignación.");
  }

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("procesar_ticket_admin.php", {
      method: "POST",
      form: {
        action: "assign_tech",
        id_ticket: ticketId,
        id_tecnico: technicianId,
        notas_tecnico: technicianNotes,
        notas_asignacion: technicianNotes,
        comentario_cliente: clientComment,
        observaciones: clientComment,
      },
    });
    const state = await stateFromApi(response, "Técnico asignado y bitácora actualizada.");
    if (state.status === "success") revalidatePath("/portal/administracion");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function updateTicketAsAdmin(formData: FormData): Promise<PortalActionState> {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session) return failure("La sesión expiró o no tiene permisos administrativos.");
  const ticketId = positiveInteger(formData, "id_ticket");
  const status = value(formData, "estado");
  const comment = value(formData, "comentario");
  if (!ticketId || ![...TICKET_STATUSES.slice(1), "Reabrir"].includes(status as never)) {
    return failure("El estado solicitado no es válido.");
  }
  if (!comment) return failure("Ingresá un comentario para la bitácora.");

  try {
    const response = await portalApiRequest<PortalApiEnvelope>("procesar_ticket_admin.php", {
      method: "POST",
      form: { action: "change_status", id_ticket: ticketId, estado: status, observaciones: comment },
    });
    const state = await stateFromApi(response, "Ticket actualizado correctamente.");
    if (state.status === "success") revalidatePath("/portal/administracion");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

async function runSystemAction(payload: Record<string, unknown>, fallback: string) {
  const session = await requirePortalActionSession([PORTAL_ROLES.ADMIN]);
  if (!session) return failure("Acceso denegado.");
  try {
    const response = await portalApiRequest<PortalApiEnvelope>("gestion_sistema.php", {
      method: "POST",
      json: payload,
    });
    const state = await stateFromApi(response, fallback);
    if (state.status === "success") revalidatePath("/portal/administracion/sistema");
    return state;
  } catch (error) {
    return apiFailure(error);
  }
}

export async function togglePortalUser(formData: FormData) {
  return runSystemAction(
    {
      action: "toggle_usuario",
      id_usuario: positiveInteger(formData, "id_usuario"),
      activo: value(formData, "activo") === "1" ? 1 : 0,
    },
    "Usuario actualizado."
  );
}

export async function savePortalUser(formData: FormData): Promise<PortalActionState> {
  const name = value(formData, "nombre");
  const email = value(formData, "email").toLowerCase();
  const role = Number(value(formData, "id_rol"));
  const password = String(formData.get("password") ?? "");
  if (!name || !EMAIL_RE.test(email) || ![1, 2, 3].includes(role)) {
    return failure("Completá correctamente los datos del usuario.");
  }
  return runSystemAction(
    {
      action: "guardar_usuario",
      id_usuario: Number(value(formData, "id_usuario")) || 0,
      nombre: name,
      email,
      id_rol: role,
      verificado: value(formData, "verificado") === "1" ? 1 : 0,
      password,
    },
    "Usuario guardado."
  );
}

export async function togglePortalTicket(formData: FormData) {
  return runSystemAction(
    {
      action: "toggle_ticket",
      id_ticket: positiveInteger(formData, "id_ticket"),
      activo: value(formData, "activo") === "1" ? 1 : 0,
    },
    "Ticket actualizado."
  );
}

export async function editPortalTicket(formData: FormData): Promise<PortalActionState> {
  const ticketId = positiveInteger(formData, "id_ticket");
  const status = value(formData, "estado");
  const priority = value(formData, "prioridad");
  const category = value(formData, "categoria");
  if (
    !ticketId ||
    !TICKET_STATUSES.includes(status as (typeof TICKET_STATUSES)[number]) ||
    !TICKET_PRIORITIES.includes(priority as (typeof TICKET_PRIORITIES)[number]) ||
    !category
  ) {
    return failure("Los datos del ticket no son válidos.");
  }
  return runSystemAction(
    {
      action: "guardar_ticket",
      id_ticket: ticketId,
      estado: status,
      prioridad: priority,
      categoria: category,
      id_tecnico: Number(value(formData, "id_tecnico")) || 0,
    },
    "Ticket actualizado."
  );
}
