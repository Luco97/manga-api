import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class updateUserDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'password'`
    })
    @Length( 5, 50, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    password: string;
}

export class loginUserDto extends updateUserDto {
    @IsEmail({},{
        message: `Falta definir la propiedad 'email'`
    })
    @Length( 6, 50, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    email: string;
}

export class createUserDto extends loginUserDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'username'`
    })
    @Length( 3, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    username: string;
}
