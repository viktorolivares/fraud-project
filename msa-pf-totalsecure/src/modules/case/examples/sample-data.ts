/**
 * Ejemplos de datos de casos basados en la tabla proporcionada
 * 
 * Estructura de la tabla 'cases':
 * - id: Primary key autoincremental
 * - execution_id: ID de la ejecución del bot
 * - capture_date: Fecha y hora de captura del caso
 * - description: Descripción del caso detectado
 * - state_id: ID del estado del caso (1 = abierto)
 * - affected_user_id: ID del usuario afectado (opcional)
 * - close_date: Fecha de cierre (opcional)
 * - close_detail: Detalle del cierre (opcional)
 * - close_evidence: Evidencia del cierre (opcional)
 */

export const exampleCases = [
  {
    executionId: 4,
    description: "Se detectaron 4 logins en una IP de la BLACKLIST",
    stateId: 1,
    // captureDate se establece automáticamente en el servicio
  },
  {
    executionId: 10,
    description: "Se detectaron 1 logins en una IP de la BLACKLIST",
    stateId: 1,
  },
  {
    executionId: 11,
    description: "Se envia la informacion de Concentracion de IP de los Registros de Digital de los ultimos 3 dias que tengan mas de 5 registros por IP. Total de incidencias en este caso: 5",
    stateId: 1,
  },
  {
    executionId: 11,
    description: "Se envia la informacion de Concentracion de IP de los Registros de Digital de los ultimos 3 dias que tengan mas de 5 registros por IP. Total de incidencias en este caso: 5",
    stateId: 1,
  },
  {
    executionId: 11,
    description: "Se envia la informacion de Concentracion de IP de los Registros de Digital de los ultimos 3 dias que tengan mas de 5 registros por IP. Total de incidencias en este caso: 11",
    stateId: 1,
  },
  {
    executionId: 11,
    description: "Se envia la informacion de Concentracion de IP de los Registros de Digital de los ultimos 3 dias que tengan mas de 5 registros por IP. Total de incidencias en este caso: 5",
    stateId: 1,
  },
  {
    executionId: 13,
    description: "Se detectaron 3 logins en una IP de la BLACKLIST",
    stateId: 1,
  },
  {
    executionId: 14,
    description: "Se envia la informacion de DNI correlativos de las ultimas 48 horas. Total de incidencias en este caso: 2",
    stateId: 1,
  },
  {
    executionId: 14,
    description: "Se envia la informacion de DNI correlativos de las ultimas 48 horas. Total de incidencias en este caso: 3",
    stateId: 1,
  },
  {
    executionId: 14,
    description: "Se envia la informacion de DNI correlativos de las ultimas 48 horas. Total de incidencias en este caso: 29",
    stateId: 1,
  }
];

/**
 * Ejemplo de uso de la API:
 * 
 * POST /cases
 * Content-Type: application/json
 * Authorization: Bearer <token>
 * 
 * {
 *   "executionId": 4,
 *   "description": "Se detectaron 4 logins en una IP de la BLACKLIST",
 *   "stateId": 1
 * }
 */
