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
    if (!category.Title) {
      return category.id;
    }
    const title = CategoryUtils.isHomeCategory(category)
      ? category.Title.split('#')[0]
      : category.Title;

    return isNaN(Number(title)) ? category.id : Number(title);
  };

  static isHomeCategory = (category: Category): boolean => {
    return category.Title.includes('#');
  };
}
