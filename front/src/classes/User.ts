import Place from "./Place";

export enum UserType {
  MEMBRE = 'MEMBRE',
  ADMIN = 'ADMIN'
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
  password?: string
  place?: Place

  constructor(
    id: string,
    username: string,
    role: UserType,
    created_at: Date,
    email: string,
    password?: string,
    place?: Place
  ) {
    this.id = id
    this.username = username
    this.role = role
    this.created_at = created_at
    this.email = email
    this.password = password
    this.place = place
  }
}
