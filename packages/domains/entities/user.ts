export type UserRole = 'admin' | 'user';
export type UserStatus = boolean

export type User = {
    id: string
    firstName: string | null
    lastName: string | null
    name: string
    email: string
    emailVerified: boolean
    company: string | null
    companyImage: string | null
    role: UserRole
    status: UserStatus
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}