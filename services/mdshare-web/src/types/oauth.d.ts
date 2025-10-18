interface OAuthProvider {
  id: string
  name: string
  icon: string
  authUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
}

interface OAuthUser {
  id: string
  username: string
  displayName: string
  email: string
  avatarUrl: string
  provider: 'google' | 'github' | 'gitlab'
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
  createdAt: Date
}

interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
  given_name?: string
  family_name?: string
}

interface OAuthRepository {
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

interface OAuthSession {
  id: string
  userId: string
  provider: string
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  createdAt: Date
}

interface OAuthState {
  provider: string
  redirectUrl: string
  userId?: string
}

interface OAuthConfig {
  google: {
    clientId: string
    clientSecret: string
    redirectUri: string
    scopes: string[]
  }
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
