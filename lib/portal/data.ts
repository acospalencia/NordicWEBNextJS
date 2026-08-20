import "server-only";

import { assertPortalApiSuccess, portalApiRequest, type PortalApiEnvelope } from "@/lib/portal/api";
import type {
  PortalEmailQueueItem,
  PortalTicket,
  PortalUser,
  TicketPriority,
  TicketStatus,
} from "@/lib/portal/types";

type ApiRecord = Record<string, unknown>;

function array(value: unknown): ApiRecord[] {
  return Array.isArray(value) ? (value as ApiRecord[]) : [];
}

export function normalizeApiTicket(row: ApiRecord): PortalTicket {
  return {
    id_ticket: Number(row.id_ticket),
    id_usuario: Number(row.id_usuario ?? row.id_cliente ?? 0),
    id_tecnico: row.id_tecnico ? Number(row.id_tecnico) : null,
    titulo: String(row.titulo ?? ""),
    descripcion: String(row.descripcion ?? ""),
    estado: String(row.estado ?? "Abierto") as TicketStatus,
    prioridad: String(row.prioridad ?? "Media") as TicketPriority,
    categoria: String(row.categoria ?? "Sin categoría"),
    otra_categoria: row.otra_categoria ? String(row.otra_categoria) : null,
    observacion_proceso: row.observacion_proceso ? String(row.observacion_proceso) : null,
    observacion_cierre: row.observacion_cierre ? String(row.observacion_cierre) : null,
    fecha_creacion: String(row.fecha_creacion ?? row.fecha ?? ""),
    fecha_actualizacion: row.fecha_actualizacion ? String(row.fecha_actualizacion) : null,
    activo: Number(row.activo ?? 1),
    cliente_nombre: row.cliente_nombre ?? row.cliente ? String(row.cliente_nombre ?? row.cliente) : null,
    cliente_email: row.cliente_email ? String(row.cliente_email) : null,
    nombre_tecnico: row.nombre_tecnico ?? row.tecnico ? String(row.nombre_tecnico ?? row.tecnico) : null,
    notas_asignacion: row.notas_asignacion ? String(row.notas_asignacion) : null,
  };
}

function normalizeApiUser(row: ApiRecord): PortalUser {
  return {
    id_usuario: Number(row.id_usuario),
    nombre: String(row.nombre ?? ""),
    email: String(row.email ?? ""),
    id_rol: Number(row.id_rol ?? 1) as PortalUser["id_rol"],
    verificado: Number(row.verificado ?? 0),
    activo: Number(row.activo ?? 1),
    codigo_empresa: row.codigo_empresa ? String(row.codigo_empresa) : null,
    fecha_registro: row.fecha_registro ? String(row.fecha_registro) : null,
  };
}

export async function getClientTickets() {
  const response = await portalApiRequest<PortalApiEnvelope>("get_tickets.php");
  assertPortalApiSuccess(response);
  return {
    name: String(response.nombre_usuario ?? "Cliente Nordictech"),
    tickets: array(response.tickets).map(normalizeApiTicket),
  };
}

export async function getTechnicianData() {
  const response = await portalApiRequest<PortalApiEnvelope>("obtener_datos_tecnico.php");
  assertPortalApiSuccess(response);
  return {
    clients: array(response.clientes).map(normalizeApiUser),
    tickets: [...array(response.tickets_proceso), ...array(response.tickets_cerrados)].map(
      normalizeApiTicket
    ),
  };
}

export async function getAdminDirectory() {
  const [clientsResponse, techniciansResponse] = await Promise.all([
    portalApiRequest<PortalApiEnvelope>("get_admin_data.php", {
      searchParams: { action: "get_clientes" },
    }),
    portalApiRequest<PortalApiEnvelope>("get_admin_data.php", {
      searchParams: { action: "get_tecnicos" },
    }),
  ]);
  assertPortalApiSuccess(clientsResponse);
  assertPortalApiSuccess(techniciansResponse);
  return {
    clients: array(clientsResponse.data).map(normalizeApiUser),
    technicians: array(techniciansResponse.data).map(normalizeApiUser),
  };
}

export async function getAdminClientTickets(clientId: number) {
  const response = await portalApiRequest<PortalApiEnvelope>("get_admin_data.php", {
    searchParams: { action: "get_tickets", id_usuario: clientId },
  });
  assertPortalApiSuccess(response);
  return array(response.data).map(normalizeApiTicket);
}

export async function getSystemData() {
  const response = await portalApiRequest<PortalApiEnvelope>("gestion_sistema.php");
  assertPortalApiSuccess(response);
  const data = (response.data ?? {}) as ApiRecord;
  const metric = (data.metricas ?? {}) as ApiRecord;

  return {
    users: array(data.usuarios).map(normalizeApiUser),
    tickets: array(data.tickets).map(normalizeApiTicket),
    emails: array(data.cola).map(
      (row): PortalEmailQueueItem => ({
        id_correo: Number(row.id_correo),
        destinatario: String(row.destinatario ?? ""),
        asunto: String(row.asunto ?? ""),
        estado: String(row.estado ?? ""),
        intentos: Number(row.intentos ?? 0),
        fecha_registro: row.fecha_registro ? String(row.fecha_registro) : null,
        fecha_envio: row.fecha_envio ? String(row.fecha_envio) : null,
      })
    ),
    metrics: {
      usuarios_activos: Number(metric.usuarios_activos ?? 0),
      usuarios_inactivos: Number(metric.usuarios_inactivos ?? 0),
      tickets_activos: Number(metric.tickets_activos ?? 0),
      tickets_cerrados: Number(metric.tickets_cerrados ?? 0),
      correos_pendientes: Number(metric.correos_pendientes ?? 0),
    },
  };
}
