import {
  Camera,
  Cloud,
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
  Radar,
  Server,
  Siren,
  Telescope,
  ThermometerSun,
  TowerControl,
  Waypoints,
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
    name: "Seguridad Electrónica, Videovigilancia y Analítica Avanzada por IA",
    summary:
      "Videovigilancia profesional con analítica perimetral, reconocimiento de matrículas, búsqueda forense e integración con VMS, alarmas y almacenamiento redundante 24/7.",
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
          "Centralización de videovigilancia, control de accesos y alarmas sobre plataformas interoperables, incluyendo el ecosistema tecnológico de Motorola Solutions.",
      },
      {
        title: "Almacenamiento Redundante e Híbrido",
        description:
          "Arquitectura de alta disponibilidad (NAS/SAN con RAID y respaldo en la nube) que garantiza la conservación ininterrumpida de evidencia crítica.",
      },
    ],
  },
  {
    slug: "videoseguridad-control-acceso-avigilon-unity",
    icon: Server,
    name: "Videoseguridad y Control de Acceso — Avigilon Unity",
    summary:
      "Diseñamos e implementamos ecosistemas locales de seguridad física con Avigilon Unity, integrando VMS, cámaras inteligentes, analítica de video, control de acceso, alarmas, servidores y almacenamiento. Centralizamos la detección, verificación e investigación de eventos en instalaciones empresariales o multisitio, con Unity Cloud Services cuando se requiere supervisión y administración remota.",
    highlight: {
      title: "Arquitectura local con control operativo",
      description:
        "Integramos una plataforma escalable alojada en la infraestructura del cliente, con gestión unificada de video y accesos y una extensión segura hacia servicios remotos cuando la operación lo requiere.",
    },
    scope: [
      {
        title: "Ingeniería de Unity Video y almacenamiento",
        description:
          "Dimensionamiento de servidores, grabación, retención, estaciones de operación y redes para una plataforma VMS local estable y escalable.",
      },
      {
        title: "Cámaras y analítica inteligente",
        description:
          "Integración de cámaras y analítica basada en IA para alertas, clasificación de personas y vehículos y búsqueda avanzada de evidencia.",
      },
      {
        title: "Unity Access y verificación por video",
        description:
          "Unificación de accesos, identidades, puertas, alarmas y video para verificar eventos y coordinar respuestas desde una sola operación.",
      },
      {
        title: "Monitoreo centralizado y gestión de eventos",
        description:
          "Configuración de reglas, alarmas, permisos por rol, mapas y flujos de trabajo para instalaciones corporativas, industriales o críticas.",
      },
      {
        title: "Operación multisitio y Unity Cloud Services",
        description:
          "Habilitación de administración remota, visualización de cámaras, intercambio de clips y supervisión de salud como extensión de la arquitectura local.",
      },
      {
        title: "Implementación y soporte del ciclo de vida",
        description:
          "Instalación, configuración, puesta en marcha, capacitación, documentación y mantenimiento de la solución completa.",
      },
    ],
  },
  {
    slug: "seguridad-fisica-nube-avigilon-alta",
    icon: Cloud,
    name: "Seguridad Física en la Nube — Avigilon Alta",
    summary:
      "Implementamos seguridad física cloud-native con Avigilon Alta para administrar video, accesos, usuarios, alertas y analítica desde web o móvil. Unificamos Alta Video y Alta Access en arquitecturas escalables para una o múltiples sedes, incorporando cámaras existentes mediante Cloud Connectors cuando son compatibles y reduciendo la dependencia de servidores locales.",
    highlight: {
      title: "Gestión cloud-native para una o múltiples sedes",
      description:
        "Centralizamos la operación de seguridad en una plataforma accesible remotamente, preparada para crecer por sitio, usuario, cámara o puerta sin replicar una infraestructura tradicional en cada ubicación.",
    },
    scope: [
      {
        title: "Alta Video y videoseguridad en la nube",
        description:
          "Configuración del VMS cloud, cámaras, retención, mapas y visualización remota desde navegador o aplicación móvil.",
      },
      {
        title: "Alta Access y credenciales móviles",
        description:
          "Implementación de control de acceso cloud con lectores, controladores, usuarios, permisos, credenciales físicas o móviles y gestión de visitantes.",
      },
      {
        title: "Analítica y alertas inteligentes",
        description:
          "Creación de reglas y notificaciones apoyadas en analítica de personas, vehículos y actividad para agilizar la verificación de incidentes.",
      },
      {
        title: "Unificación de video y accesos",
        description:
          "Correlación de eventos de puertas con video en vivo o grabado para investigar incidentes desde una experiencia operacional común.",
      },
      {
        title: "Migración mediante Cloud Connectors",
        description:
          "Evaluación e incorporación de cámaras y dispositivos existentes compatibles para facilitar una transición gradual hacia la nube.",
      },
      {
        title: "Diseño, despliegue y soporte multisitio",
        description:
          "Planificación de conectividad, licenciamiento, configuración, capacitación y soporte para organizaciones distribuidas.",
      },
    ],
  },
  {
    slug: "videovigilancia-termica-largo-alcance",
    icon: Telescope,
    name: "Videovigilancia Térmica y de Largo Alcance",
    summary:
      "Diseñamos sistemas electroópticos de vigilancia térmica y visible para detectar, seguir y verificar objetivos a grandes distancias en perímetros extensos. Integramos plataformas Silent Sentinel con analítica, posicionamiento PTZ, radar y VMS para proteger puertos, aeropuertos, instalaciones industriales e infraestructura crítica, incluso en entornos marítimos y condiciones ambientales exigentes.",
    highlight: {
      title: "Visibilidad más allá del perímetro convencional",
      description:
        "Combinamos sensores térmicos y visibles de largo alcance con seguimiento inteligente para anticipar amenazas y entregar al operador información verificable en escenarios complejos.",
    },
    scope: [
      {
        title: "Selección de sensores electroópticos EO/IR",
        description:
          "Diseño de configuraciones con cámaras térmicas LWIR o MWIR y sensores visibles de baja iluminación según distancia, objetivo y ambiente.",
      },
      {
        title: "Plataformas PTZ de alta precisión",
        description:
          "Integración de posicionadores continuos y cargas multisensor para cubrir perímetros amplios con movimientos rápidos y precisos.",
      },
      {
        title: "Detección, clasificación y seguimiento",
        description:
          "Configuración de analítica para identificar actividad relevante, seguir objetivos y reducir falsas alarmas antes de presentar eventos al operador.",
      },
      {
        title: "Integración con radar y VMS",
        description:
          "Correlación de detecciones externas con video térmico o visible y conexión con plataformas de gestión para una respuesta centralizada.",
      },
      {
        title: "Aplicaciones críticas y marítimas",
        description:
          "Soluciones para puertos, costas, aeropuertos, fronteras, industria y activos estratégicos expuestos a condiciones exigentes.",
      },
      {
        title: "Instalación, puesta en marcha y mantenimiento",
        description:
          "Montaje, alineación, configuración, pruebas de desempeño, capacitación y soporte preventivo de la solución desplegada.",
      },
    ],
  },
  {
    slug: "deteccion-supresion-incendios",
    icon: Flame,
    name: "Detección y Supresión de Incendios",
    summary:
      "Diseño, instalación y mantenimiento de detección temprana, paneles direccionables y supresión automática, integrados con BMS y bajo normativas NFPA.",
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
    name: "Control de Acceso y Biometría",
    summary:
      "Identificación biométrica, credenciales inteligentes, torniquetes, molinetes y cerraduras conectadas a plataformas centralizadas de administración y auditoría.",
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
    name: "Automatización y Building Management Systems (BMS)",
    summary:
      "Integración de iluminación, climatización, energía, alarmas, CCTV y seguridad para eficiencia operativa, ahorro energético y mantenimiento predictivo.",
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
    slug: "monitoreo-ambiental-instrumentacion",
    icon: ThermometerSun,
    name: "Monitoreo Ambiental e Instrumentación de Precisión",
    summary:
      "Implementamos sistemas de monitoreo ambiental e instrumentación de precisión con tecnología Vaisala para centros de datos, cuartos técnicos, industria y ambientes controlados. Integramos medición continua de temperatura, humedad, punto de rocío, CO₂ y presión diferencial con alarmas, trazabilidad e interoperabilidad hacia BMS o plataformas de supervisión existentes.",
    highlight: {
      title: "Datos confiables para continuidad y eficiencia",
      description:
        "Convertimos variables ambientales críticas en información operativa precisa para proteger equipos, optimizar HVAC y sostener condiciones controladas con trazabilidad histórica.",
    },
    scope: [
      {
        title: "Ingeniería de puntos de medición",
        description:
          "Levantamiento y definición de ubicaciones, rangos, precisión, conectividad y redundancia según el riesgo de cada instalación.",
      },
      {
        title: "Sensores, sondas y transmisores industriales",
        description:
          "Integración de instrumentos para temperatura, humedad relativa, punto de rocío, CO₂ y presión diferencial en espacios o ductos.",
      },
      {
        title: "Monitoreo continuo y registro histórico",
        description:
          "Implementación de data loggers y plataformas como viewLinc para supervisión permanente, tendencias, alarmas y trazabilidad de mediciones.",
      },
      {
        title: "Centros de datos y cuartos técnicos",
        description:
          "Supervisión ambiental para proteger equipos críticos, detectar desviaciones y respaldar la optimización de climatización y consumo energético.",
      },
      {
        title: "Integración con BMS y plataformas existentes",
        description:
          "Intercambio de datos mediante Modbus, OPC UA o API cuando la arquitectura y los equipos seleccionados lo permiten.",
      },
      {
        title: "Instalación, verificación y soporte",
        description:
          "Montaje, configuración, pruebas, coordinación de calibración, documentación y mantenimiento periódico de la solución.",
      },
    ],
  },
  {
    slug: "alerta-temprana-desastres-naturales",
    icon: Siren,
    name: "Sistemas de Alerta Temprana ante Desastres Naturales",
    summary:
      "Diseñamos e integramos sistemas de alerta temprana que conectan monitoreo ambiental e hidrometeorológico, telemetría, análisis de condiciones y canales de aviso para anticipar inundaciones, crecidas, lluvias intensas, deslizamientos y otros fenómenos naturales. La solución abarca estaciones remotas, centros de control, sirenas, mensajería y notificaciones para operadores, autoridades o comunidades.",
    highlight: {
      title: "Monitoreo → Comunicación → Análisis → Detección → Alerta",
      description:
        "Convertimos datos de campo en información accionable mediante un flujo integral que detecta condiciones de riesgo y distribuye alertas autorizadas por los canales definidos para cada proyecto.",
    },
    scope: [
      {
        title: "Sensores y estaciones hidrometeorológicas",
        description:
          "Integración de estaciones meteorológicas, pluviómetros, nivel de agua y variables como presión, humedad y temperatura según el fenómeno y el estudio técnico.",
      },
      {
        title: "Telemetría y comunicaciones multicanal",
        description:
          "Transmisión de datos desde ubicaciones remotas mediante radio, celular, IP, satélite u otros enlaces disponibles, con redundancia cuando la criticidad lo exige.",
      },
      {
        title: "Adquisición, análisis y detección",
        description:
          "Configuración de concentradores, reglas, umbrales y correlación de variables para identificar oportunamente condiciones potencialmente peligrosas.",
      },
      {
        title: "Centros de monitoreo y visualización GIS",
        description:
          "Dashboards, mapas, tendencias, registro histórico y supervisión de estaciones para cuencas, laderas, costas, municipios o infraestructura crítica.",
      },
      {
        title: "Alertamiento y coordinación de emergencias",
        description:
          "Integración con flujos autorizados de sirenas, torres, altavoces, mensajes de voz, balizas y notificaciones remotas hacia operadores o población.",
      },
      {
        title: "Continuidad, puesta en marcha y mantenimiento",
        description:
          "Energía solar o de respaldo, comunicaciones redundantes, pruebas integrales, capacitación, documentación y mantenimiento preventivo de la solución.",
      },
    ],
  },
  {
    slug: "aire-acondicionado-electromecanica",
    icon: Wind,
    name: "Aire Acondicionado e Ingeniería Electromecánica",
    summary:
      "Diseño HVAC, instalación de equipos, extracción, chillers, VRF/VRV, ducterías y mantenimiento electromecánico para instalaciones comerciales, industriales y de misión crítica.",
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
    name: "Electricidad",
    summary:
      "Soluciones de baja y media tensión, tableros, distribución, canalización, iluminación, respaldo eléctrico, UPS y puesta a tierra para infraestructura comercial e industrial.",
    highlight: {
      title: "Calidad de Energía y Continuidad Directa",
      description:
        "Protegemos la operación de su empresa contra interrupciones y fluctuaciones energéticas mediante infraestructuras eléctricas redundantes, normadas y preparadas para alta demanda.",
    },
    scope: [
      {
        title: "Instalaciones de Media y Baja Tensión",
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
          "Rutas de canalización pesada e industrial (bandejas portacables, tubería EMT/IMC, ductos subterráneos) y soluciones de iluminación LED de alto rendimiento y control inteligente.",
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
    slug: "redes-comunicaciones",
    icon: Waypoints,
    name: "Redes y Comunicaciones",
    summary:
      "Diseñamos e implementamos infraestructuras de redes y comunicaciones seguras, estables y escalables para entornos corporativos, industriales y críticos. Integramos LAN, WAN, Wi-Fi empresarial, fibra óptica, switching, routing, enlaces inalámbricos, firewalls y VPN, asegurando conectividad confiable para videovigilancia, control de acceso, automatización, IoT y demás plataformas tecnológicas.",
    highlight: {
      title: "Conectividad segura de extremo a extremo",
      description:
        "Unificamos infraestructura física, networking y seguridad en una arquitectura administrable y resiliente, seleccionando tecnologías Cisco, Fortinet, Ubiquiti, Lightera/Furukawa u otras compatibles según cada proyecto.",
    },
    scope: [
      {
        title: "Arquitectura LAN, WAN y backbone",
        description:
          "Levantamiento, diseño lógico y físico, direccionamiento, capacidad, redundancia y alta disponibilidad para sedes, campus e instalaciones críticas.",
      },
      {
        title: "Cableado estructurado y fibra óptica",
        description:
          "Integración de cobre, fibra monomodo o multimodo, racks, canalizaciones, distribución principal y certificación de enlaces instalados.",
      },
      {
        title: "Wi-Fi empresarial y enlaces inalámbricos",
        description:
          "Diseño de cobertura, capacidad y roaming, configuración de redes inalámbricas y enlaces punto a punto o multipunto.",
      },
      {
        title: "Switching, routing y segmentación",
        description:
          "Configuración de switches y routers, VLAN, enlaces troncales, calidad de servicio y políticas para separar usuarios, IoT y sistemas críticos.",
      },
      {
        title: "Firewalls, VPN y seguridad de red",
        description:
          "Protección perimetral, acceso remoto seguro, interconexión de sedes y controles de tráfico alineados con los riesgos operativos del cliente.",
      },
      {
        title: "Monitoreo, diagnóstico y soporte",
        description:
          "Supervisión centralizada, análisis de desempeño, optimización, documentación y soporte para cámaras, accesos, automatización y otras plataformas conectadas.",
      },
    ],
  },
  {
    slug: "cableado-fibra-optica",
    icon: Cable,
    name: "Cableado Estructurado y Fibra Óptica",
    summary:
      "Redes Cat6/Cat6A, fibra monomodo y multimodo, certificación FLUKE, racks, cuartos de telecomunicaciones y topologías avanzadas como Spine-Leaf.",
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
    name: "Redes GPON",
    summary:
      "Redes pasivas de fibra óptica para datos, voz y video con OLT, ONT, splitters, FTTH/FTTB, certificación, planificación de capacidad y optimización.",
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
    name: "Equipos de Acceso, Switches y Firewalls",
    summary:
      "Suministro e integración de equipos L2/L3, enrutadores, enlaces de alta capacidad, firewalls de próxima generación, segmentación y administración centralizada.",
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
    name: "Telefonía IP y Videoconferencia",
    summary:
      "PBX IP, teléfonos inteligentes, videoconferencia HD/4K, salas de reuniones, colaboración remota y plataformas de administración unificada de voz y video.",
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
    name: "Sistemas de Respaldo y Energía Fotovoltaica",
    summary:
      "UPS, bancos de baterías, sistemas solares, inversores, tableros de transferencia y diseño energético orientado a eficiencia operativa y continuidad del negocio.",
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
          "Soluciones diseñadas para reducir la huella de carbono de su empresa, facilitar la obtención de certificaciones de edificios verdes (LEED, EDGE) y fortalecer la responsabilidad social corporativa.",
      },
    ],
  },
  {
    slug: "sistemas-maritimos-ayudas-navegacion",
    icon: TowerControl,
    name: "Sistemas Marítimos y Ayudas a la Navegación",
    summary:
      "Diseñamos e integramos ayudas a la navegación y sistemas de señalización para puertos, puentes, helipuertos, instalaciones offshore y zonas marítimas. Con tecnología Pharos Marine Automatic Power implementamos linternas, balizas, AIS AtoN, iluminación aeronáutica, energía remota y respaldo, cubriendo ingeniería, suministro, instalación, puesta en marcha y mantenimiento para ambientes severos o clasificados.",
    highlight: {
      title: "Señalización confiable en condiciones extremas",
      description:
        "Integramos equipos marítimos, aeronáuticos y de energía remota dentro de una solución documentada y mantenible, dimensionada para la criticidad operacional de cada emplazamiento.",
    },
    scope: [
      {
        title: "Ayudas marítimas a la navegación (AtoN)",
        description:
          "Selección e integración de linternas, balizas, boyas y sistemas de señalización para canales, puertos, estructuras fijas o flotantes.",
      },
      {
        title: "Señalización de puentes y faros",
        description:
          "Implementación de luces de canal, luces de enfilación, balizas de faro y señalización de obstáculos sobre aguas navegables.",
      },
      {
        title: "Helipuertos e iluminación de obstáculos",
        description:
          "Diseño e instalación de iluminación para helidecks e infraestructura aeronáutica asociada a operaciones portuarias u offshore.",
      },
      {
        title: "AIS AtoN, RACON y monitoreo remoto",
        description:
          "Integración de identificación automática, balizas radar y supervisión del estado o posición de las ayudas a la navegación.",
      },
      {
        title: "Energía remota, solar y standby",
        description:
          "Dimensionamiento de alimentación autónoma o de respaldo para ubicaciones aisladas, plataformas y aplicaciones de baja disponibilidad de red.",
      },
      {
        title: "Ingeniería, commissioning y mantenimiento",
        description:
          "Levantamiento, diseño, suministro, instalación, puesta en marcha, pruebas de aceptación, capacitación y mantenimiento preventivo.",
      },
    ],
  },
  {
    slug: "navegacion-maritima-monitoreo-costero",
    icon: Radar,
    name: "Navegación Marítima y Monitoreo Costero",
    summary:
      "Integramos plataformas profesionales TIMEZERO para navegación, cartografía electrónica y vigilancia marítima. Centralizamos cartas náuticas, radar, AIS, GPS y sensores compatibles en una interfaz operacional que mejora el conocimiento situacional, el seguimiento de embarcaciones y la supervisión de puertos o costas, tanto a bordo como en centros de monitoreo y control.",
    highlight: {
      title: "Conocimiento situacional marítimo unificado",
      description:
        "Consolidamos cartografía, blancos y sensores de navegación en una experiencia operacional coherente para tomar decisiones con mayor contexto a bordo o desde tierra.",
    },
    scope: [
      {
        title: "TIMEZERO Professional",
        description:
          "Instalación y configuración de estaciones profesionales de navegación con espacios de trabajo, rutas, alarmas y perfiles operativos.",
      },
      {
        title: "Cartografía electrónica y planificación",
        description:
          "Configuración de cartas compatibles, capas operativas, rutas, waypoints y herramientas de planificación para cada zona de navegación.",
      },
      {
        title: "Integración de radar, AIS y GPS",
        description:
          "Conexión de sensores e instrumentos compatibles mediante redes y protocolos marítimos para visualizar posición, rumbo y objetivos.",
      },
      {
        title: "Seguimiento de embarcaciones y alarmas",
        description:
          "Presentación de blancos AIS o ARPA, trazas, zonas de vigilancia y avisos operativos para apoyar una respuesta oportuna.",
      },
      {
        title: "TIMEZERO Coastal Monitoring",
        description:
          "Diseño de puestos y centros de vigilancia costera que combinan radar, AIS, cámaras y cartografía en una interfaz centralizada.",
      },
      {
        title: "Puesta en marcha, formación y soporte",
        description:
          "Configuración de equipos, pruebas de integración, perfiles de usuario, capacitación operacional y mantenimiento de la plataforma.",
      },
    ],
  },
  {
    slug: "audiovisuales-multimedia",
    icon: MonitorPlay,
    name: "Soluciones Audiovisuales y Multimedia",
    summary:
      "Integración de video walls, pantallas profesionales, proyectores, sonido, auditorios, salas interactivas, centros de operaciones y controladores AV.",
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
    slug: "servicios-especiales",
    icon: Boxes,
    name: "Servicios Especiales e Integración Llave en Mano",
    summary:
      "Soluciones a la medida que integran centros de monitoreo, cuartos de control e infraestructura tecnológica para sectores corporativos y gubernamentales.",
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
          "Desarrollo de soluciones a medida con altos estándares de confidencialidad, cumplimiento normativo (ISO, NFPA, TIA/EIA) y certificaciones de seguridad.",
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
