import { 
  PieChart, 
  BookOpen, 
  Bot, 
  Settings2, 
  FileSpreadsheet, 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle,
  UserCheck,
  Activity,
  GitBranch,
  ClipboardList,
  BarChart3
} from "lucide-react";

const navMain = [
  {
    title: "Dashboard",
    icon: PieChart,
    url: "/dashboard",
    isActive: true,
    items: [
      { title: "Resumen General", url: "/dashboard/overview" },
      { title: "Resumen 7 días", url: "/dashboard/summary" },
      { title: "Análisis de Bots", url: "/dashboard/bot-details" },
    ],
  },

  {
    title: "Gestión de Casos",
    icon: FileText,
    url: "/cases",
    items: [
      { title: "Lista de Casos", url: "/cases" },
      { title: "Asignaciones", url: "/case-assignments" },
      { title: "Incidentes", url: "/case-incidents" },
      { title: "Estados de Casos", url: "/case-states" },
    ],
  },

  {
    title: "Automatización",
    icon: Bot,
    url: "/bots",
    items: [
      { title: "Gestión de Bots", url: "/bots" },
      { title: "Historial de Ejecuciones", url: "/bot-executions" },
    ],
  },

  {
    title: "Conciliaciones",
    icon: FileSpreadsheet,
    url: "/conciliations",
    items: [
      { title: "Lista de Conciliaciones", url: "/conciliations" },
      { title: "Gestión de Collectors", url: "/collectors" },
    ],
  },

  {
    title: "Reportes y Análisis",
    icon: BarChart3,
    url: "/reports",
    items: [
      { title: "Reportes por Bot", url: "/reports" },
      // { title: "Análisis Temporal", url: "/reports/temporal" },
      // { title: "Métricas de Rendimiento", url: "/reports/performance" },
    ],
  },

  {
    title: "Administración",
    icon: Settings2,
    url: "/users",
    items: [
      { title: "Gestión de Usuarios", url: "/users" },
      { title: "Roles y Accesos", url: "/roles" },
      { title: "Permisos del Sistema", url: "/permissions" },
      { title: "Módulos de Sistema", url: "/modules" },
    ],
  },

  {
    title: "Configuración",
    url: "/config",
    icon: Settings2,
    items: [
      { title: "Preferencias del Sistema", url: "/config/preferences" },
      { title: "Entorno de Pruebas", url: "/test" },
    ],
  },
];

export default navMain;
