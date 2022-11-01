import { User } from "./interface";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const NAME_REGEX = /^[a-zA-Z ]{2,30}$/;
export const GAME_NAME_REGEX = /^[0-9a-zA-Z ... ]+$/
export const ANSWER_REGEX = /^[a-z]*$/;

export const DEFAULT_USER_AND_ADMIN: User = {
    email : "admin@gmail.com",
    password : "admin@123",
    isAdmin : true,
    name : "Subham Jain",
    games : [],
    picture : undefined
}