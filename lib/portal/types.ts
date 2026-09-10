export const PORTAL_ROLES = {
  CLIENT: 1,
  TECHNICIAN: 2,
  ADMIN: 3,
} as const;

export type PortalRole = (typeof PORTAL_ROLES)[keyof typeof PORTAL_ROLES];

export type PortalSession = {
  userId: number;
  name: string;
  role: PortalRole;
  countCenterSlug: string | null;
  lastActivity: number;
};

export const TICKET_STATUSES = ["Abierto", "En Proceso", "Resuelto", "Cerrado"] as const;
export const TICKET_PRIORITIES = ["Baja", "Media", "Alta", "Crítica"] as const;
export const TICKET_CATEGORIES = ["CCTV", "Control de acceso", "Panel de incendios", "Otro"] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export type PortalActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type PortalUser = {
  id_usuario: number;
  nombre: string;
  email: string;
  id_rol: PortalRole;
  verificado: number;
  activo: number;
  conteo_center_slug?: string | null;
  codigo_empresa?: string | null;
  fecha_registro?: string | null;
};

export type PortalTicket = {
  id_ticket: number;
  id_usuario: number;
  id_tecnico: number | null;
  titulo: string;
  descripcion: string;
  estado: TicketStatus;
  prioridad: TicketPriority;
  categoria: string;
  otra_categoria: string | null;
  observacion_proceso: string | null;
  observacion_cierre: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  activo: number;
  cliente_nombre?: string | null;
  cliente_email?: string | null;
  nombre_tecnico?: string | null;
  notas_asignacion?: string | null;
};

export type PortalEmailQueueItem = {
  id_correo: number;
  destinatario: string;
  asunto: string;
  estado: string;
  intentos: number;
  fecha_registro: string | null;
  fecha_envio: string | null;
};
