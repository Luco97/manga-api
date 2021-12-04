import { IsEmail, IsNotEmpty, Length, ValidationArguments } from "class-validator";

export class SignUp {
    @IsNotEmpty({
        message: 'email  no ingresado'
    })
    @IsEmail()
    @Length(8,30, {
        message: typeNumber(4, 30, 'email')
    })
    email;

    @IsNotEmpty({
        message: 'username no ingresado'
    })
    @Length( 5, 18, {
        message: typeNumber( 5, 18, 'username')
    })
    username;

    @IsNotEmpty({
        message: 'password no ingresada'
    })
    @Length( 6, 20, {
        message: typeNumber( 6, 20, 'password')
    })
    password;
}

function typeNumber(min: number, max: number, name: string) {
    return (validationArgument: ValidationArguments): string => {
        if(validationArgument.value < min)  return `${name} bajo el minimo de caracteres`;
        if(validationArgument.value > max) return  `${name} supera el maximo de caracteres`;
    }
}