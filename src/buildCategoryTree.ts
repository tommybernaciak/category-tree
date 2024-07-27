import { CategoryListElement, CategoryUtils } from './CategoryUtils';
import { Category } from './mockedApi';

export const buildCategoryListElement = (
  category: Category
): CategoryListElement => {
  return {
    name: category.name,
    id: category.id,
    image: CategoryUtils.getImage(category),
    order: CategoryUtils.getOrder(category),
    children: buildCategoryList(category.children),
    showOnHome: false,
  };
};

export const buildCategoryList = (
  categories: Category[]
): CategoryListElement[] => {
  return categories
    .map((category) => buildCategoryListElement(category))
    .sort((a, b) => a.order - b.order);
};

export const buildCategoryTree = (
  categories: Category[]
): CategoryListElement[] => {
  const homeCategories = categories.filter((c) =>
    CategoryUtils.isHomeCategory(c)
  );
  const categoryTree = buildCategoryList(categories);

  // if results are less than 5 => show all
  // if there are some with # in Title => show those
  // if not => show first 3
  if (categoryTree.length < 5) {
    categoryTree.forEach((c) => (c.showOnHome = true));
  } else if (homeCategories.length > 0) {
    const toShowOnHome = homeCategories.map((c) => c.id);
    categoryTree.forEach((c) => (c.showOnHome = toShowOnHome.includes(c.id)));
  } else {
    categoryTree.forEach((c, index) => (c.showOnHome = index < 3));
  }
  return categoryTree;
};
