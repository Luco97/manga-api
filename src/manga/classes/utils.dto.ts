import { IsOptional, Min } from 'class-validator';

export class Pagination {
  @IsOptional()
  @Min(1, {
    message: 'Valor no puede ser menor que 1',
  })
  take: number;

  @IsOptional()
  @Min(0, {
    message: 'Valor no puede ser menor a 0',
  })
  skip: number;
}
