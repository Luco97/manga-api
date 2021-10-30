import { IsNotEmpty, Length } from "class-validator";

export class Login {
    @IsNotEmpty()
    @Length( 5, 18)
    username: string;
    
    @IsNotEmpty()
    @Length( 6, 20)
    password;
}
