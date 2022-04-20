import { MangaEntity } from '@db/manga/entity';

export interface response {
  status: number;
  message: string;
}

export interface Artist {
  id: number;
  name: string;
  artistic_name?: string;
  age?: number;
  country?: string;
  type?: string;
  mangas?: MangaEntity[];
  count?: number;
}

export interface Genre {
  id: number;
  tag: string;
  mangas?: MangaEntity[];
  count?: number;
}

export interface Language {
  id: number;
  language: string;
  mangas?: MangaEntity[];
  count?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  mangas?: MangaEntity[];
}

export interface Manga {
  id: number;
  title: string;
  pages: number;
  artists?: Artist[];
  genres?: Genre[];
  languages?: Language[];
  users?: User[];
}

export interface MangaResponse {
  id: number;
  title: string;
  pages: number;
  artists?: Artist[];
  genres?: Genre[];
  languages?: Language[];
  count?: number;
}

export interface MangaResponse {
  /* manga?: Manga;
  mangas?: Manga[]; */
  lenght?: number;
  next?: string;
  previous?: string;
}
