// Centralized entities export
export { User } from '@modules/user/domain/user.entity';
export { UserRole } from '@modules/user/domain/user-role.entity';
export { Role } from '@modules/role/domain/role.entity';
export { RolePermission } from '@modules/role/domain/role-permission.entity';
export { Permission } from '@modules/permission/domain/permission.entity';
export { Module } from '@modules/module/domain/module.entity';
export { Channel } from '@modules/channel/domain/channel.entity';
export { Bot } from '@modules/bot/domain/bot.entity';
export { BotExecution } from '@modules/bot-execution/domain/bot-execution.entity';

// Case-related entities
export { Case } from '@modules/case/domain/case.entity';
export { CaseState } from '@modules/case-state/domain/case-state.entity';
export { CaseIncident } from '@modules/case-incident/domain/case-incident.entity';
export { CaseNote } from '@modules/case-note/domain/case-note.entity';
export { CaseAssignment } from '@modules/case-assignment/domain/case-assignment.entity';
export { CaseIncidentAssignment } from '@modules/case-incident-assignment/domain/case-incident-assignment.entity';

// Additional entities
export { Client } from '@modules/client/domain/client.entity';
export { SystemType } from '@modules/system-type/domain/system-type.entity';
export { Collector } from '@modules/collector/domain/collector.entity';
export { Conciliation } from '@modules/conciliation/domain/conciliation.entity';
export { ConciliationFile } from '@modules/conciliation-file/domain/conciliation-file.entity';
export { Log } from '@modules/log/domain/log.entity';
