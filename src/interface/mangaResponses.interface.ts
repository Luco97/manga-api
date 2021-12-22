interface Artist {
  id: number;
  name: string;
  artisticName?: string;
  age?: number;
  country?: string;
  type?: string;
  count?: number;
}

interface Genre {
  id: number;
  tag: string;
  count?: number;
}

interface Language {
  id: number;
  language: string;
  count?: number;
}

interface Manga {
  title: string;
  pages: number;
  artists?: Artist[];
  genres?: Genre[];
  language?: Language[];
}

interface response {
  status: number;
  message: string;
}

export interface ArtistResponse extends response {
  artist: Artist;
}

export interface GenreResponse extends response {
  genre: Genre;
}

export interface LanguageResponse extends response {
  language: Language;
}

export interface MangaResponse extends response {
  manga?: Manga;
  mangas?: Manga[];
  lenght?: number;
  next?: string;
  previous?: string;
}
