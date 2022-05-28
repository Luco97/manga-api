import { MaxLength, MinLength } from 'class-validator';

export class CommentDto {
  user?: { id: number; username: string };

  @MinLength(5, {
    message: 'Ponle ganas al comentario ctm',
  })
  @MaxLength(500, {
    message: 'No es cuento la wea',
  })
  comment: string;
}
