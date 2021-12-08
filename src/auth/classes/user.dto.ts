import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'username'`
    })
    @Length( 3, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    username: string;

    @IsNotEmpty({
        message: `Falta definir la propiedad 'email'`
    })
    @IsEmail()
    @Length( 6, 50, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    email: string;

    @IsNotEmpty({
        message: `Falta definir la propiedad 'password'`
    })
    @Length( 5, 50, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    password: string;
}
