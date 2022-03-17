import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        <title>App de mierda</title>
        <style>
        h1 {
          color: blue;
        }
        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          top: 5rem;
          justify-content: center;

          .content {
            background-color: red;
          }
        }
        </style>
    </head>
    <body class="container">
        <h1 class="content">Hello world!</h1>
    </body>
    </html>`;
  }
}
