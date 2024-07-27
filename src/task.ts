import { CategoryListElement } from './CategoryUtils';
import { buildCategoryTree } from './buildCategoryTree';
import { Category, getCategories } from './mockedApi';

export const categoryTree = async (
  getInputCategories: () => Promise<{ data: Category[] }> = getCategories
): Promise<CategoryListElement[]> => {
  const res = await getInputCategories();

  if (!res.data) {
    return [];
  }
  if (!Array.isArray(res.data)) {
    return [];
  }
  return buildCategoryTree(res.data);
};
