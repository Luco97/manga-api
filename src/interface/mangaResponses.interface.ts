import { MangaEntity } from '@db/manga/entity';

export interface response {
  status: number;
  message: string;
  error?: any;
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
  country_flag: string;
  mangas?: MangaEntity[];
  count?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  mangas?: MangaEntity[];
  count?: number;
}

export interface Manga {
  id: number;
  title: string;
  pages: number;
  likes: number;
  created_at?: Date;
  isFavorite?: boolean;
  cover?: string;
  artists?: Artist[];
  genres?: Genre[];
  languages?: Language[];
  users?: User[];
}

export interface MangaResponse {
  id: number;
  title: string;
  pages: number;
  likes: number;
  created_at?: Date;
  updated_at?: Date;
  artists?: Artist[];
  genres?: Genre[];
  languages?: Language[];
  count?: number;
}

export interface Commentary {
  id: number;
  comment: string;
  created_at: Date;
}

// export interface MangaResponse {
//   /* manga?: Manga;
//   mangas?: Manga[]; */
//   lenght?: number;
//   next?: string;
//   previous?: string;
// }
