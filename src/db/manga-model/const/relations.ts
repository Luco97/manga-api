export const artistRelations: string[] = ['mangas'];

export const genreRelations: string[] = ['mangas'];

export const languageRelations: string[] = ['mangas'];

export const mangaRelations: string[] = ['genres', 'languages', 'artists'];

export const searchByColumn = {
  artists: 'name',
  genres: 'tag',
  languages: 'language',
};

export const mangaColumns: string[] = ['id', 'title', 'pages', 'created_at'];
