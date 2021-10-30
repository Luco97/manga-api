import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class SignUp {
    @IsEmail()
    email;

    @IsNotEmpty()
    @Length( 5, 18)
    username;

    @IsNotEmpty()
    @Length( 6, 20)
    password;
}
