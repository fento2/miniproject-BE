export enum ErrorMsg {
  // General
  INTERNAL_SERVER_ERROR = "Internal server error",
  ROUTE_NOT_FOUND = "Route not found",

  // Auth
  INVALID_EMAIL_OR_PASSWORD = "Invalid email or password",
  UNAUTHORIZED = "Unauthorized access",
  TOKEN_NOT_FOUND = "Token not found",
  TOKEN_INVALID = "Invalid token",
  TOKEN_EXPIRED = "Token expired",
  TOKEN_NOT_PROVIDED = "no token provided",
  INVALID_INPUT = "Invalid input data",
  MISSING_QUERY_PARAMETERS = "Missing query parameters",
  SERVER_MISSING_SECRET_KEY = "server error missing secret key",
  UNKNOWN_ERROR = "Unknown errror",
  REFERRAL_GIVEN_NOT_FOUND = "ReferralCode not found",
  EMAIL_NOT_FOUND = "Email not Found",
  CANNOT_GET_DATA = "Cannot get data user",
  INVALID_ROLE_ID = "Invalid Role ID",

  //Event
  FAILD_CREATE_EVENT = "Faild Create Event",
  FAILD_UPDATE_EVENT = "Faild Update Event",
  MUST_BE_ORGANIZER = "Must Be Organizer",

  //Transaction
  MUST_BE_CUSTOMER = "Must Be Customer",
}
