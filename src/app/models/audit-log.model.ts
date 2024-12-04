import { User } from "./user.model";

 
export interface AuditLog {
    auditLogId: number;
    action: string;
    PerformedByUser:User;
    timestamp: Date;
}