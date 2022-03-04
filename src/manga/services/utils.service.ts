import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Manga, response } from '@interface/mangaResponses.interface';

@Injectable()
export class UtilsService {
  mangaCreateSubject: Subject<{ response: response; data?: Manga }> =
    new Subject();
  mangaFavoriteSubject: Subject<{ response: response; data?: Manga }> =
    new Subject();
  mangaDropSubject: Subject<{ response: response; data?: Manga }> =
    new Subject();
}
