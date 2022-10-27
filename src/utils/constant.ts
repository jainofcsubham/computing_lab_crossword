export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const NAME_REGEX = /^[a-zA-Z ]{2,30}$/;

export const DEFAULT_USER_AND_ADMIN = {
    email : "admin@gmail.com",
    password : "admin@123",
    isAdmin : true,
    name : "Subham Jain"
}