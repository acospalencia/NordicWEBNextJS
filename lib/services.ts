import {
  Camera,
  Flame,
  Fingerprint,
  Building2,
  Wind,
  Zap,
  Cable,
  Network,
  Router,
  Phone,
  Sun,
  MonitorPlay,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export type ScopeItem = string | { title: string; description: string };

export type Service = {
  slug: string;
  icon: LucideIcon;
  name: string;
  summary: string;
  scope: ScopeItem[];
  highlight?: { title: string; description: string };
};

export const SERVICES: Service[] = [
  {
    slug: "seguridad-videovigilancia",
    icon: Camera,
    name: "Seguridad Electrónica, Videovigilancia Inteligente y Control de Acceso",
    summary:
      "Transforme la seguridad pasiva en un sistema activo de prevención y análisis operativo mediante Inteligencia Artificial.",
    highlight: {
      title: "Prevención Proactiva y Gestión de Riesgos",
      description:
        "Más que grabar incidentes, implementamos analítica avanzada que detecta amenazas antes de que ocurran, integrando video, accesos y almacenamiento seguro en una sola plataforma centralizada.",
    },
    scope: [
      {
        title: "Detección y Clasificación Inteligente",
        description:
          "Filtrado preciso de personas, vehículos y objetos para eliminar hasta un 95% de falsas alarmas provocadas por clima o vegetación.",
      },
      {
        title: "Protección Perimetral Avanzada",
        description:
          "Detección de intrusión, cruce de línea y merodeo con alertas automáticas y disuasión inmediata.",
      },
      {
        title: "Reconocimiento de Matrículas (LPR / ANPR)",
        description:
          "Automatización de accesos vehiculares, listas blancas/negras y registro de tiempos de permanencia.",
      },
      {
        title: "Inteligencia Operativa y Conteo",
        description:
          "Medición de afluencia, mapa de calor, control de ocupación máxima y métricas de negocio en tiempo real.",
      },
      {
        title: "Búsqueda Forense Inteligente",
        description:
          "Localización rápida de eventos o individuos en segundos mediante búsqueda por atributos (color de ropa, tipo de vehículo, horario).",
      },
      {
        title: "Ecosistema Integrado (VMS + Accesos + Alarmas)",
        description:
          "Centralización de videovigilancia con control de accesos biométricos/RFID, sensores perimetrales y plataformas VMS líderes del mercado.",
      },
      {
        title: "Almacenamiento Redundante e Híbrido",
        description:
          "Arquitectura de alta disponibilidad (NAS/SAN con RAID y respaldo en la nube) que garantiza la conservación ininterrumpida de evidencia crítica.",
      },
    ],
  },
  {
    slug: "deteccion-supresion-incendios",
    icon: Flame,
    name: "Sistemas de Detección Temprana y Supresión Automática de Incendios",
    summary:
      "Salvaguarde activos críticos, garantice la continuidad operativa y cumpla con los estándares internacionales más exigentes de seguridad contra incendios.",
    highlight: {
      title: "Ingeniería Normativa y Protección Integral",
      description:
        "Diseñamos e implementamos soluciones llave en mano bajo normativas NFPA, enfocadas en la detección ultratemprana y la extinción limpia sin dañar equipos electrónicos sensibles.",
    },
    scope: [
      {
        title: "Detección Temprana y Paneles Direccionables",
        description:
          "Centrales de alarma de última generación con identificación exacta del punto de origen de cualquier anomalía o conato de incendio.",
      },
      {
        title: "Sensores y Dispositivos Inteligentes",
        description:
          "Detección fotoeléctrica, térmica, multigases y sistemas por aspiración de alta sensibilidad (VESDA) para entornos críticos.",
      },
      {
        title: "Sistemas de Supresión Automática",
        description:
          "Soluciones de extinción mediante agentes limpios (FM-200, Novec 1230 / FK-5-1-12), CO₂ o agua pulverizada/nebulizada, ideales para Data Centers y salas de control.",
      },
      {
        title: "Integración con Sistemas BMS (Building Management Systems)",
        description:
          "Interconexión con climatización (HVAC), control de accesos, presurización de escaleras y corte de suministros energéticos ante emergencias.",
      },
      {
        title: "Cumplimiento Estricto de Normativas NFPA",
        description:
          "Diseño, pruebas y puesta en marcha alineados rigurosamente a estándares internacionales (NFPA 72, NFPA 2001, NFPA 13/75).",
      },
      {
        title: "Pruebas de Integridad y Mantenimiento Normativo",
        description:
          "Verificación de hermeticidad de salas (Door Fan Test), mantenimiento preventivo y certificación periódica de la red.",
      },
    ],
  },
  {
    slug: "control-acceso-biometria",
    icon: Fingerprint,
    name: "Sistemas Avanzados de Control de Acceso y Biometría",
    summary:
      "Gestione el flujo de personas y vehículos en tiempo real con tecnologías de identificación biométrica, credenciales digitales y administración centralizada.",
    highlight: {
      title: "Gestión Eficiente y Trazabilidad Total",
      description:
        "Elimine vulnerabilidades de acceso, automatice el registro de personal y visitas, y obtenga reportes de auditoría en tiempo real desde una sola plataforma unificada.",
    },
    scope: [
      {
        title: "Identificación Biométrica de Vanguardia",
        description:
          "Lectoras de reconocimiento facial sin contacto (Liveness Detection / Anti-spoofing), huella dactilar, vena y lectura de iris de alta precisión.",
      },
      {
        title: "Credenciales Inteligentes y Móviles",
        description:
          "Gestión de accesos mediante tarjetas RFID/Mifare Desfire encriptadas, códigos QR dinámicos y credenciales móviles en teléfonos inteligentes (Bluetooth/NFC).",
      },
      {
        title: "Barreras Físicas y Control Vehicular",
        description:
          "Suministro e instalación de torniquetes, molinetes de alta velocidad, pasillos ópticos de cristal, barreras vehiculares y bolardos de alta seguridad.",
      },
      {
        title: "Cerraduras e Integración Electromecánica",
        description:
          "Cerraduras mecatrónicas, electroimanes de alto libraje, contras eléctricas y sistemas autónomos o en red para puertas de alta frecuencia.",
      },
      {
        title: "Plataforma Centralizada de Gestión y Auditoría",
        description:
          "Software unificado para control de aforos, administración de roles y permisos, gestión de visitantes, mapas interactivos y reportes detallados de auditoría.",
      },
      {
        title: "Integración con Nómina y Sistemas de Tiempo y Asistencia",
        description:
          "Interconexión directa de eventos de marcado con software de Recursos Humanos para automatizar el control pre-nómina.",
      },
    ],
  },
  {
    slug: "automatizacion-bms",
    icon: Building2,
    name: "Automatización y Sistemas de Gestión de Edificios Inteligentes (BMS / BAS)",
    summary:
      "Centralice la inteligencia de su infraestructura para maximizar la eficiencia energética, optimizar la operación y transformar sus instalaciones en edificios verdaderamente inteligentes.",
    highlight: {
      title: "Eficiencia Operativa y Sustentabilidad",
      description:
        "Integre todos los subsistemas críticos en una sola plataforma unificada para reducir el consumo energético, automatizar procesos y anticiparse a fallas operativas antes de que afecten la continuidad del negocio.",
    },
    scope: [
      {
        title: "Integración Multidisciplinaria de Subsistemas",
        description:
          "Centralización y control unificado de HVAC (climatización), iluminación inteligente, distribución eléctrica, detección de incendios, CCTV, control de acceso y bombeo de agua.",
      },
      {
        title: "Plataformas Abiertas e Interoperables",
        description:
          "Soporte e integración nativa mediante protocolos estándar de la industria como BACnet (IP/MSTP), Modbus, KNX, LonWorks y MQTT.",
      },
      {
        title: "Gestión Inteligente de Energía (EMS)",
        description:
          "Monitoreo en tiempo real del consumo eléctrico, medición por zonas, análisis de calidad de potencia y rutinas avanzadas de ahorro energético y deslastre de carga.",
      },
      {
        title: "Tableros de Control Interactivos (Dashboards & SCADA)",
        description:
          "Interfaces gráficas 2D/3D intuitivas para supervisión remota, gestión de alarmas en tiempo real, tendencias históricas e indicadores clave de rendimiento (KPIs).",
      },
      {
        title: "Mantenimiento Predictivo y Algoritmos de Diagnóstico",
        description:
          "Análisis automatizado de horas de uso y desviación de variables operativas para programar mantenimientos basados en la condición real de los equipos, reduciendo tiempos de parada no planificados.",
      },
      {
        title: "Cumplimiento de Estándares de Sustentabilidad",
        description:
          "Herramientas de reporte de datos diseñadas para respaldar procesos de certificación ambiental (LEED, BREEAM, EDGE) y optimizar el rendimiento energético del inmueble.",
      },
    ],
  },
  {
    slug: "aire-acondicionado-electromecanica",
    icon: Wind,
    name: "Ingeniería Electromecánica y Climatización de Alta Eficiencia (HVAC)",
    summary:
      "Diseñamos e implementamos infraestructura de climatización y proyectos electromecánicos de alta precisión para instalaciones industriales, comerciales y entornos de misión crítica.",
    highlight: {
      title: "Continuidad Operativa y Control Térmico de Precisión",
      description:
        "Garantice condiciones ambientales rigurosamente controladas y una gestión térmica redundante para proteger la continuidad de sus operaciones más exigentes.",
    },
    scope: [
      {
        title: "Diseño e Ingeniería Térmica HVAC",
        description:
          "Cálculo de cargas térmicas, diseño de distribución de aire y simulación de flujos para optimización de consumo energético y confort.",
      },
      {
        title: "Sistemas de Misión Crítica (Precision Cooling)",
        description:
          "Equipos de aire acondicionado de precisión (CRAC/CRAH), inyección bajo piso técnico y pasillos fríos/calientes para Data Centers, laboratorios y salas de control.",
      },
      {
        title: "Sistemas Centralizados de Alta Eficiencia (Chillers, VRF / VRV)",
        description:
          "Instalación, puesta en marcha y control de plantas de agua helada (Chillers) y sistemas de Volumen de Refrigerante Variable de expansión directa.",
      },
      {
        title: "Ingeniería de Ventilación y Extracción Industrial",
        description:
          "Redes de ducterías de bajo nivel de ruido, sistemas de extracción de gases, inyección de aire filtrado, filtración HEPA y presurización de áreas.",
      },
      {
        title: "Instalaciones Electromecánicas Integrales",
        description:
          "Montaje de fuerza eléctrica asociada, tableros de distribución HVAC, bombas, tuberías hidráulicas y aislamiento térmico normado.",
      },
      {
        title: "Mantenimiento Preventivo y Auditoría Térmica",
        description:
          "Servicios de balanceo de flujo de aire (TAB), termografía infrarroja, análisis de refrigerante y planes de conservación preventiva periódica.",
      },
    ],
  },
  {
    slug: "electricidad",
    icon: Zap,
    name: "Ingeniería Eléctrica, Distribución y Sistemas de Respaldo de Energía",
    summary:
      "Diseñamos e implementamos soluciones eléctricas integrales en media y baja tensión, garantizando la continuidad del suministro y la máxima seguridad para sus instalaciones.",
    highlight: {
      title: "Calidad de Energía y Continuidad Directa",
      description:
        "Protegemos la operación de su empresa contra interrupciones y fluctuaciones energéticas mediante infraestructuras eléctricas redundantes, normadas y preparadas para alta demanda.",
    },
    scope: [
      {
        title: "Proyectos de Media y Baja Tensión",
        description:
          "Ingeniería, diseño, trámites de factibilidad y montaje de subestaciones eléctricas, acometidas, transformadores y redes de distribución corporativa e industrial.",
      },
      {
        title: "Diseño e Integración de Tableros Eléctricos",
        description:
          "Fabricación, armado y etiquetado de tableros generales de distribución (TGD), centros de control de motores (CCM), transferencia automática (TTA) y tableros de iluminación.",
      },
      {
        title: "Sistemas de Respaldo Eléctrico de Misión Crítica (UPS y Grupos Electrógenos)",
        description:
          "Instalación y configuración de UPS industriales/modulares en arquitectura N+1, plantas eléctricas diésel/gas e integración con sistemas de transferencia sin interrupción.",
      },
      {
        title: "Sistemas de Canalización e Iluminación Eficiente",
        description:
          "Rutas de canalización pesada e industrial (bandejas portacables, tubería EMT/IMC, ductos subterráneos) y proyectos de iluminación LED de alto rendimiento y control inteligente.",
      },
      {
        title: "Sistemas de Puesta a Tierra (SPAT) y Protección Atmosférica",
        description:
          "Medición de resistividad de terreno, diseño de mallas a tierra dedicadas para cómputo y fuerza, pararrayos y protección contra sobretensiones transitorias (TVSS/SPD).",
      },
      {
        title: "Diagnóstico de Calidad de Energía y Mantenimiento",
        description:
          "Análisis de armónicos, termografía infrarroja de tableros, estudio de código de red, balanceo de cargas y certificación de instalaciones bajo normativas de seguridad vigentes.",
      },
    ],
  },
  {
    slug: "cableado-fibra-optica",
    icon: Cable,
    name: "Infraestructura de Red, Cableado Estructurado y Fibra Óptica",
    summary:
      "Diseñamos e implementamos redes de alta velocidad, escalables y sin puntos de fallo para garantizar la conectividad crítica de su empresa.",
    highlight: {
      title: "Certificación de Red de Nivel Industrial",
      description:
        "Entregamos cada proyecto con certificación oficial FLUKE, asegurando el cumplimiento estricto de estándares internacionales y cero cuellos de botella.",
    },
    scope: [
      {
        title: "Cableado de Alta Velocidad (Cat6 / Cat6A)",
        description:
          "Instalación para entornos corporativos e industriales con optimización de ancho de banda y reducción de interferencias.",
      },
      {
        title: "Redes de Fibra Óptica (Monomodo y Multimodo)",
        description: "Conexiones de larga distancia y backbones de ultra baja latencia.",
      },
      {
        title: "Arquitectura Avanzada Spine-Leaf",
        description:
          "Diseño de red de alta disponibilidad y redundancia para centros de datos y redes empresariales modernas.",
      },
      {
        title: "Ingeniería de Racks y Cuartos de Telecomunicaciones (MDF/IDF)",
        description: "Montaje, peinado de cableado profesional, etiquetado normativo y gestión térmica.",
      },
      {
        title: "Certificación y Diagnóstico FLUKE",
        description:
          "Pruebas de campo con reporte técnico detallado que avalan el rendimiento y la garantía de la red.",
      },
    ],
  },
  {
    slug: "redes-gpon",
    icon: Network,
    name: "Redes Ópticas Pasivas GPON / POL (Passive Optical LAN)",
    summary:
      "Infraestructura de fibra óptica convergente de ultra alta velocidad y densidad para la transmisión unificada de datos, voz, video y servicios IoT.",
    highlight: {
      title: "Eficiencia Financiera y Escalabilidad sin Límites",
      description:
        "Reduzca los costos de espacio, cableado y energía hasta en un 50% frente al cableado tradicional, sustituyendo cuartos intermedios por una red pasiva de larga distancia y vida útil prolongada.",
    },
    scope: [
      {
        title: "Diseño e Implementación de Redes FTTH / FTTB / POL",
        description:
          "Arquitectura de fibra hasta el hogar, edificio o escritorio, ideal para hoteles, desarrollos residenciales, hospitales, campus universitarios y complejos corporativos.",
      },
      {
        title: "Configuración Avanzada de OLT y Terminales ONT/ONU",
        description:
          "Provisión, aprovisionamiento centralizado y gestión de anchos de banda para OLTs (Optical Line Terminal) y ONTs corporativas con servicios triple play (Voz IP, IPTV, Datos, Wi-Fi).",
      },
      {
        title: "Ingeniería de Red Pasiva y Divisores Ópticos (Splitters)",
        description:
          "Cálculo de presupuesto de potencia óptica (Power Budget), diseño de niveles de división ópticos (splitters balanceados y desbalanceados) y rutas de distribución principal y secundaria.",
      },
      {
        title: "Planificación de Capacidad y Redundancia",
        description:
          "Dimensionamiento de tráfico de red para entornos de alta densidad de usuarios, priorización de tráfico (QoS) y topologías redundantes de anillo o protección tipo B/C.",
      },
      {
        title: "Certificación Óptica de Campo",
        description:
          "Pruebas e inspección de fibra mediante mediciones OTDR (Reflectometría en el Dominio del Tiempo), comprobación de pérdida de inserción (Power Meter) y certificación de reflectancia bajo estándares internacionales.",
      },
      {
        title: "Migración y Convergencia de Servicios",
        description:
          "Integración de subsistemas de seguridad (CCTV, Control de Acceso, BMS) sobre la misma infraestructura de fibra GPON, simplificando la administración de la red.",
      },
    ],
  },
  {
    slug: "switches-firewalls",
    icon: Router,
    name: "Equipos de Acceso, Conmutación Avanzada y Ciberseguridad Perimetral (Switches L2/L3 & NGFW)",
    summary:
      "Diseñamos e implementamos arquitecturas de red seguras, escalables y de alta velocidad, protegiendo los activos digitales de su empresa contra amenazas avanzadas.",
    highlight: {
      title: "Protección Perimetral y Redes de Alto Rendimiento",
      description:
        "Combine conmutación de ultra baja latencia con seguridad de próxima generación para garantizar el rendimiento de sus aplicaciones críticas y blindar la infraestructura corporativa.",
    },
    scope: [
      {
        title: "Conmutación Avanzada L2/L3 (Switches Core, Distribución y Acceso)",
        description:
          "Configuración de switches gestionables de alta densidad, apilamiento (stacking), enlaces troncales de alta velocidad (10G/40G/100G) y alimentación PoE+ / PoE++ para dispositivos de borde.",
      },
      {
        title: "Firewalls de Próxima Generación (NGFW)",
        description:
          "Despliegue de seguridad perimetral con inspección profunda de paquetes (DPI), prevención de intrusiones (IPS/IDS), filtrado web/DNS, control de aplicaciones y protección contra malware en tiempo real.",
      },
      {
        title: "Enrutamiento de Alta Capacidad e Interconexión (Routers / SD-WAN)",
        description:
          "Enrutamiento dinámico (OSPF, BGP), optimización de enlaces WAN, balanceo de carga de tráfico e implementación de arquitecturas SD-WAN para sedes remotas y nube.",
      },
      {
        title: "Segmentación de Red y Modelo Zero Trust",
        description:
          "Diseño de VLANs corporativas, microsegmentación de tráfico, control de acceso a la red (NAC) y políticas estrictas para aislar entornos críticos (servidores, IoT, CCTV, red de invitados).",
      },
      {
        title: "Conectividad Remota Segura (VPN)",
        description:
          "Implementación de redes privadas virtuales (VPN SSL / IPsec con MFA) para el trabajo remoto seguro y la interconexión encriptada punto a punto entre sucursales.",
      },
      {
        title: "Gestión Centralizada y Visibilidad (Cloud / On-Premise)",
        description:
          "Administración unificada de la infraestructura de red, monitoreo de salud del sistema, análisis de tráfico en tiempo real y alertas automatizadas ante anomalías.",
      },
    ],
  },
  {
    slug: "telefonia-ip-videoconferencia",
    icon: Phone,
    name: "Comunicaciones Unificadas, Telefonía IP y Salas de Videoconferencia HD/4K",
    summary:
      "Conecte a sus equipos de trabajo desde cualquier lugar con plataformas de voz, video y colaboración de alta definición integradas a sus procesos de negocio.",
    highlight: {
      title: "Colaboración Sin Fronteras y Operación Híbrida",
      description:
        "Modernice su infraestructura de comunicaciones reduciendo costos operativos, integrando telefonía corporativa en dispositivos móviles y transformando salas de reuniones en espacios interactivos de alto impacto.",
    },
    scope: [
      {
        title: "Comunicaciones Unificadas (UCaaS / IP-PBX)",
        description:
          "Despliegue de centrales telefónicas IP (físicas o en la nube), integración de voz, mensajería instantánea, presencia y buzón de voz unificado.",
      },
      {
        title: "Telefonía Corporativa Inteligente y Movilidad",
        description:
          "Suministro de teléfonos IP de escritorio, audioconferencia, softphones para smartphones y laptops, y esquemas de extensión única para personal en campo o teletrabajo.",
      },
      {
        title: "Equipamiento de Salas de Videoconferencia (HD / 4K)",
        description:
          "Diseño e integración de barras de video inteligentes con IA (autoframing, seguimiento de voz y cancelación activa de ruido), micrófonos de techo y pantallas interactivas.",
      },
      {
        title: "Ecosistemas de Colaboración (Teams Rooms / Zoom Rooms / SIP)",
        description:
          "Configuración e integración nativa de hardware para salas con plataformas líderes del mercado (Microsoft Teams, Zoom, Cisco Webex, Meet).",
      },
      {
        title: "Gestión de Tráfico de Voz (QoS y Trunking SIP)",
        description:
          "Configuración de Calidad de Servicio (QoS) en la red para garantizar cero latencia/eco, integración con líneas E1/PRI/SIP Trunks y enrutamiento inteligente de llamadas.",
      },
      {
        title: "Administración Centralizada y Analítica",
        description:
          "Panel de control unificado para gestión de usuarios, tarificación, grabación de llamadas corporativas, IVR (Contestadora Automática Multi-nivel) y métricas de atención telefónica.",
      },
    ],
  },
  {
    slug: "respaldo-energia-fotovoltaica",
    icon: Sun,
    name: "Sistemas de Respaldo de Energía y Generación Fotovoltaica",
    summary:
      "Asegure la continuidad de sus operaciones críticas y reduzca drásticamente los costos operativos con soluciones integrales de energía limpia y respaldo ininterrumpido.",
    highlight: {
      title: "Independencia Energética y Cero Tiempo de Inactividad",
      description:
        "Combine la rentabilidad económica de la energía solar con sistemas avanzados de almacenamiento (BESS) y UPS para proteger su infraestructura contra fallas de la red eléctrica, maximizando al mismo tiempo su sustentabilidad corporativa.",
    },
    scope: [
      {
        title: "Sistemas UPS de Misión Crítica y Almacenamiento",
        description:
          "Implementación de UPS (Online Doble Conversión) modulares y redundantes, acoplados a bancos de baterías de ciclo profundo (VRLA o Ion-Litio) para Data Centers, hospitales e industria.",
      },
      {
        title: "Generación Fotovoltaica Industrial y Comercial",
        description:
          "Ingeniería, diseño e instalación de paneles solares de alta eficiencia, inversores string y microinversores en esquemas On-Grid, Off-Grid o Híbridos para reducción directa de la factura eléctrica.",
      },
      {
        title: "Transferencia Automática y Sincronismo (TTA / ATS)",
        description:
          "Diseño e instalación de tableros de transferencia automática y sistemas de sincronismo para garantizar la transición indetectable entre la red pública, la energía solar y los generadores de emergencia.",
      },
      {
        title: "Sistemas BESS (Battery Energy Storage Systems)",
        description:
          "Integración de soluciones de almacenamiento de energía a gran escala para \"Peak Shaving\" (reducción de picos de demanda), evitando penalizaciones tarifarias en horarios de alto costo.",
      },
      {
        title: "Auditoría Energética y Análisis de ROI",
        description:
          "Estudios detallados de perfil de carga, análisis de retorno de inversión, proyección de ahorro proyectado a 20 años y gestión de trámites para inyección de excedentes a la red (Net Billing/Metering).",
      },
      {
        title: "Cumplimiento de Metas de Sustentabilidad (ESG)",
        description:
          "Proyectos diseñados para reducir la huella de carbono de su empresa, facilitar la obtención de certificaciones de edificios verdes (LEED, EDGE) y fortalecer la responsabilidad social corporativa.",
      },
    ],
  },
  {
    slug: "audiovisuales-multimedia",
    icon: MonitorPlay,
    name: "Soluciones Audiovisuales Avanzadas, Multimedia y Controladores AV",
    summary:
      "Diseñamos e integramos infraestructuras audiovisuales de alto impacto y tecnología inmersiva para salas de control, centros de operaciones, auditorios y espacios corporativos.",
    highlight: {
      title: "Visualización Crítica y Experiencia Inmersiva",
      description:
        "Transforme sus espacios de toma de decisiones e interacción con desplegables visuales de ultra alta resolución, distribución de señal AV sobre IP y procesamiento multicanal diseñado para operación continua 24/7.",
    },
    scope: [
      {
        title: "Video Walls y Pantallas Profesionales de Grado Industrial",
        description:
          "Selección, montaje e integración de Video Walls (LED Direct View o LCD de bisel ultra delgado) con calibración de color, alto brillo y diseñados para misión crítica 24/7.",
      },
      {
        title: "Sistemas Audiovisuales para Centros de Control (NOC / SOC)",
        description:
          "Controladores AV y matrices de conmutación para la visualización centralizada, procesamiento multiventana (PiP) y distribución en tiempo real de múltiples fuentes de datos y cámaras.",
      },
      {
        title: "Integración para Auditorios y Salones de Eventos",
        description:
          "Proyección de alta luminosidad (Láser), arreglos de altavoces de línea (Line Array), sistemas de microfonía inalámbrica profesional y sonorización acústicamente optimizada.",
      },
      {
        title: "Salas Interactivas y Espacios de Colaboración (Huddle Rooms)",
        description:
          "Pantallas táctiles interactivas, pizarras digitales, soluciones de presentación inalámbrica multiplataforma y automatización de escenas (luces, persianas y AV).",
      },
      {
        title: "Distribución de Audio y Video sobre IP (AVoIP)",
        description:
          "Arquitecturas escalables de transmisión de video 4K sin compresión y ultra baja latencia a través de la red de datos local (LAN) mediante protocolos estándar.",
      },
      {
        title: "Sistemas de Control y Automatización Centralizada",
        description:
          "Interfaces táctiles personalizadas (touch panels) para el control simplificado de todos los subsistemas AV, fuentes de medios y escenarios ambientales a un solo toque.",
      },
    ],
  },
  {
    slug: "proyectos-especiales",
    icon: Boxes,
    name: "Proyectos Especiales e Integración Tecnológica \"Llave en Mano\" (Turnkey Solutions)",
    summary:
      "Diseñamos, ejecutamos e integramos proyectos tecnológicos complejos y a la medida, coordinando múltiples especialidades en una única solución centralizada.",
    highlight: {
      title: "Gestión Unificada y Cero Fricción",
      description:
        "Asumimos la responsabilidad total del ciclo de vida del proyecto —desde la ingeniería conceptual hasta la puesta en marcha— garantizando interoperabilidad, cumplimiento normativo y ejecución sin contratiempos.",
    },
    scope: [
      {
        title: "Diseño e Implementación de Centros de Monitoreo y Cuartos de Control (C4 / C5 / NOC / SOC)",
        description:
          "Soluciones integrales que abarcan ergonomía (consola industrial), ingeniería visual (Video Wall), climatización de precisión, respaldo eléctrico e iluminación normada.",
      },
      {
        title: "Infraestructura Tecnológica Llave en Mano (EPC - Engineering, Procurement, Construction)",
        description:
          "Gestión completa de compras, logística, obra civil menor, montaje electromecánico y configuración de software para grandes infraestructuras.",
      },
      {
        title: "Integración Multidisciplinaria Convergente",
        description:
          "Orquestación sinérgica de red física, fibra óptica, ciberseguridad, videovigilancia con IA, control de acceso, sistemas contra incendio y automatización BMS en una sola plataforma operativa.",
      },
      {
        title: "Soluciones Estratégicas para Sector Corporativo, Industrial y Gubernamental",
        description:
          "Desarrollo de proyectos a medida con altos estándares de confidencialidad, cumplimiento normativo (ISO, NFPA, TIA/EIA) y certificaciones de seguridad.",
      },
      {
        title: "Commissioning, Puesta en Marcha y Certificación",
        description:
          "Pruebas integrales de estrés, validación de redundancia de subsistemas, documentación \"As-Built\" y capacitación operativa exhaustiva para el personal del cliente.",
      },
      {
        title: "Gestión de Proyecto (PMI / PMP) y Continuidad",
        description:
          "Dirección profesional con metodologías estándar de la industria, asegurando el control estricto de tiempos, presupuesto, riesgos y garantía extendida posventa.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((service) => service.slug === slug);
}
