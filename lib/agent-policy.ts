export type AgentRole = "viewer" | "operator" | "admin";
export type AgentPermission = "read" | "write" | "financial";
export type AgentTool = "search_destinations" | "create_enquiry" | "update_booking" | "issue_refund";

const toolPermissions: Record<AgentTool, AgentPermission> = {
  search_destinations: "read",
  create_enquiry: "write",
  update_booking: "write",
  issue_refund: "financial"
};

const rolePermissions: Record<AgentRole, AgentPermission[]> = {
  viewer: ["read"],
  operator: ["read", "write"],
  admin: ["read", "write", "financial"]
};

export type AgentAuthorizationInput = {
  actorId: string;
  actorRole: AgentRole;
  tool: AgentTool;
  approved?: boolean;
  requestId: string;
};

export type AgentAuthorization = {
  allowed: boolean;
  reason: string;
  auditEvent: { requestId: string; actorId: string; actorRole: AgentRole; tool: AgentTool; permission: AgentPermission; decision: "allowed" | "denied" };
};

export function authorizeAgentAction(input: AgentAuthorizationInput): AgentAuthorization {
  if (!input || !Object.prototype.hasOwnProperty.call(toolPermissions, input.tool) ||
      !Object.prototype.hasOwnProperty.call(rolePermissions, input.actorRole)) {
    throw new Error("Unknown agent role or tool; action denied");
  }
  if (typeof input.actorId !== "string" || typeof input.requestId !== "string" ||
      input.actorId.length > 128 || input.requestId.length > 128 ||
      /[\u0000-\u001f\u007f]/.test(input.actorId) || /[\u0000-\u001f\u007f]/.test(input.requestId)) {
    throw new Error("Invalid agent audit identifiers; action denied");
  }
  const permission = toolPermissions[input.tool];
  const roleAllowed = rolePermissions[input.actorRole].includes(permission);
  const approvalRequired = permission !== "read";
  const approved = !approvalRequired || input.approved === true;
  const traceable = input.actorId.trim().length > 0 && input.requestId.trim().length > 0;
  const allowed = traceable && roleAllowed && approved;
  const reason = !traceable
    ? "Actor and request identifiers are required for an audit trail"
    : !roleAllowed
    ? `Role ${input.actorRole} cannot perform ${permission} actions`
    : !approved
      ? "Explicit human approval is required for this action"
      : "Action is authorized";

  return {
    allowed,
    reason,
    auditEvent: {
      requestId: input.requestId,
      actorId: input.actorId,
      actorRole: input.actorRole,
      tool: input.tool,
      permission,
      decision: allowed ? "allowed" : "denied"
    }
  };
}
