import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignUp {
  @IsNotEmpty({
    message: 'email  no ingresado',
  })
  @IsEmail()
  @Length(8, 30)
  email;

  @IsNotEmpty({
    message: 'username no ingresado',
  })
  @Length(5, 18)
  username;

  @IsNotEmpty({
    message: 'password no ingresada',
  })
  @Length(6, 20)
  password;
}
