
export enum UserType {
  MEMBRE,
  ADMIN
}
export const userTypeToString = (type: UserType): string => {
  return UserType[type];
};
export const userTypeOptions = [ UserType.MEMBRE, UserType.ADMIN ]

export default class User {
  id: string
  username: string
  role: UserType
  created_at: Date
  email: string

  constructor(
    id: string,
    username: string,
    role: UserType,
    created_at: Date,
    email: string
  ) {
    this.id = id
    this.username = username
    this.role = role
    this.created_at = created_at
    this.email = email
  }
}
