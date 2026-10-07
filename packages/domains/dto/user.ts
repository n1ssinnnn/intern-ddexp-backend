export type SignUpRequest = {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    companyImageUrl?: string | null;
    password: string;
}

export type SignInRequest = {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export type CreateUserRequest = {
    firstName: string
    lastName: string
    email: string
    company: string
    role: string
    password: string
    confirmedPassword: string
}