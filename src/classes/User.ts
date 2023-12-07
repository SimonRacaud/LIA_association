export default class User {
  id: string
  username: string
  role: string
  created_at: Date
  email: string

  constructor(
    id: string,
    username: string,
    role: string,
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
