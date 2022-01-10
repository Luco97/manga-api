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
  count?: number;
}

export interface Genre {
  id: number;
  tag: string;
  count?: number;
}

export interface Language {
  id: number;
  language: string;
  count?: number;
}

export interface Manga {
  title: string;
  pages: number;
  artists?: Artist[];
  genres?: Genre[];
  language?: Language[];
}


export interface MangaResponse {
  /* manga?: Manga;
  mangas?: Manga[]; */
  lenght?: number;
  next?: string;
  previous?: string;
}
