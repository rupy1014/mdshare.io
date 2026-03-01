export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'member' | 'viewer'

const roleLevel: Record<WorkspaceRole, number> = {
  owner: 5,
  admin: 4,
  editor: 3,
  member: 2,
  viewer: 1,
}

export function hasRoleAtLeast(current: WorkspaceRole, required: WorkspaceRole): boolean {
  return roleLevel[current] >= roleLevel[required]
}

export function commandRequiredRole(command: string): WorkspaceRole {
  const map: Record<string, WorkspaceRole> = {
    'workspace:create': 'admin',
    'workspace:settings': 'admin',
    invite: 'admin',
    'cohort:init': 'admin',
    promote: 'admin',
    'publish:core': 'admin',
    'publish:cohort': 'editor',
    'publish:personal': 'member',
    'doc:write': 'member',
    'whoami:permissions': 'viewer',
  }
  return map[command] ?? 'viewer'
}

export function canRunCommand(role: WorkspaceRole, command: string): boolean {
  return hasRoleAtLeast(role, commandRequiredRole(command))
}

export function getPermissionSnapshot(role: WorkspaceRole) {
  const commands = [
    'workspace:create',
    'workspace:settings',
    'invite',
    'cohort:init',
    'promote',
    'publish:core',
    'publish:cohort',
    'publish:personal',
    'doc:write',
    'whoami:permissions',
  ]

  return {
    role,
    commands: commands.reduce<Record<string, boolean>>((acc, cmd) => {
      acc[cmd] = canRunCommand(role, cmd)
      return acc
    }, {}),
  }
}
