export enum AuthCookieNames {
  ApiToken = 'micro_api_token',
  ApiTokenId = 'micro_api_token_id',
  Expiry = 'micro_expiry',
  Namespace = 'micro_namespace',
  Token = 'micro_token',
  Refresh = 'micro_refresh',
}

export enum TrackingCookieNames {
  FirstVisit = 'first_visit',
  FirstVerification = 'first_verification',
  TrackingId = 'tr_id',
}

export const GET_STARTED_STORAGE_KEY = 'get-started-return-path'
export const RECENTLY_VIEWED_KEY = 'recently-viewed'
export const FIRST_TIME_LOGIN_KEY = 'first-time-login'
export const REDIRECT_TO_KEY = 'redirectTo'

export enum SessionStorageKeys {
  RedirectToAfterLogin = 'redirectTo',
  SubscriptionFlow = 'subscription-flow',
  HideBanner = 'hideBanner',
}

export enum RegisterFlows {
  SubscriptionProFlow = 'subscription-pro-flow',
}

export enum Routes {
  Home = '/',
  Explore = '/explore',
  GettingStarted = '/getting-started',
  Login = '/login',
  SignUp = '/register',
  UserSettings = '/account/settings',
  UserKeys = '/account/keys',
  UserBilling = '/account/billing',
  UserUsage = '/account/usage',
  Pricing = '/pricing',
  Trending = '/trending',
  SubscriptionCardDetails = '/subscriptions',
  SubscriptionSuccess = '/subscriptions/success',
}

export enum LandingPageExampleNames {
  DbCreate = 'Db.Create',
  DbList = 'Db.Read',
  UserCreate = 'User.Create',
  UserLogin = 'User.Login',
}

export enum QueryKeys {
  ApiKey = 'api-keys',
  BillingAccount = 'billing-account',
  CloudApps = 'cloud-apps',
  CloudUsers = 'cloud-users',
  CloudFunctions = 'cloud-functions',
  CloudDatabaseTables = 'cloud-database-tables',
  CurrentBalance = 'current-balance',
  History = 'history',
  SavedCards = 'saved-cards',
  SetupCard = 'setup-card',
}

export enum BillingApiRoutes {
  SubscribeTier = '/billing/subscribeTier',
}

export enum SubscriptionPlans {
  Free = 'free',
  Solo = 'solo',
  Pro = 'pro',
  Business = 'business',
}

export enum TimeSelections {
  ThisMonth = 'This month',
  LastMonth = 'Last month',
  Past30Days = 'Past 30 days',
}
