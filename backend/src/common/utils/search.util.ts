/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
export interface SearchOptions {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  limit?: number;
  offset?: number;
}

export class SearchUtil {
  static buildSearchQuery(options: SearchOptions, alias: string = 'entity') {
    const { query, fields = ['title', 'content'], fuzzy = true, limit = 20, offset = 0 } = options;

    const searchConditions = fields.map((field) => {
      const column = `${alias}.${field}`;
      if (fuzzy) {
        return `${column} ILIKE :query`;
      }
      return `${column} = :query`;
    });

    const whereClause = searchConditions.join(' OR ');
    const queryParams = {
      query: fuzzy ? `%${query}%` : query,
    };

    return {
      where: whereClause,
      params: queryParams,
      limit,
      offset,
    };
  }

  static highlightMatches(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  static extractKeywords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2);
    
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return [...new Set(words)].filter((word) => !stopWords.has(word));
  }
}
