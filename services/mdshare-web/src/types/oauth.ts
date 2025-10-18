export interface OAuthProvider {
  id: string
  name: string
  icon: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
}

export interface OAuthUser {
  id: string
  username: string
  displayName: string
  email: string
  avatarUrl: string
  provider: 'github' | 'gitlab'
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
  createdAt: Date
}

export interface OAuthRepository {
  id: string
  name: string
  fullName: string
  description?: string
  url: string
  cloneUrl: string
  defaultBranch: string
  isPrivate: boolean
  owner: {
    id: string
    username: string
    avatarUrl: string
  }
  permissions: {
    admin: boolean
    push: boolean
    pull: boolean
  }
  lastPushedAt: Date
  language?: string
  size: number
}

export interface OAuthSession {
  id: string
  userId: string
  provider: string
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  createdAt: Date
}

export interface OAuthState {
  provider: string
  redirectUrl: string
  userId?: string
}

export interface OAuthConfig {
  github: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
  }
  gitlab: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
  }
}
