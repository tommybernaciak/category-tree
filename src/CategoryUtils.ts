import { UrlUtils } from './UrlUtils';
import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export class CategoryUtils {
  static getImage = (category: Category): string => {
    if (category.children.length > 0) {
      return UrlUtils.handleImageUrl(
        category.url,
        'https://anotherprovider.com'
      );
    }
    return category.MetaTagDescription || '';
  };

  static getOrder = (category: Category): number => {
    const title = category.Title;
    if (!title) {
      return category.id;
    }
    if (title.includes('#')) {
      return Number(title.split('#')[0]);
    }
    if (!isNaN(Number(title))) {
      return Number(title);
    }
    return category.id;
  };

  static isHomeCategory = (category: Category): boolean => {
    return category.Title.includes('#');
  };
}
