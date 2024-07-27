import test from 'ava';

import { CategoryUtils } from './CategoryUtils';
import { UrlUtils } from './UrlUtils';
import {
  buildCategoryListElement,
  buildCategoryTree,
} from './buildCategoryTree';
import { CORRECT } from './correctResult';
import { INPUT } from './input';
import { Category } from './mockedApi';
import { categoryTree } from './task';

test('categoryTree returns empty array when no data received', async (t) => {
  const getCategories = async (): Promise<{ data: Category[] }> => ({
    data: [],
  });

  t.deepEqual(await categoryTree(getCategories), []);
});

test('categoryTree returns correct results for given input', async (t) => {
  const getCategories = async (): Promise<{ data: Category[] }> => ({
    data: INPUT,
  });

  t.deepEqual(await categoryTree(getCategories), CORRECT);
});

test('buildCategoryTree() returns all categories as home categories if less than 5', (t) => {
  const input: Category[] = [
    {
      id: 1,
      Title: '1',
      children: [],
    } as Category,
    {
      id: 2,
      Title: '2',
      children: [],
    } as Category,
    {
      id: 3,
      Title: '3',
      children: [],
    } as Category,
    {
      id: 4,
      Title: '4',
      children: [],
    } as Category,
  ];

  t.deepEqual(
    buildCategoryTree(input).map((c) => c.showOnHome),
    [true, true, true, true]
  );
});

test('buildCategoryTree() returns all categories as home categories if less than 5, even if some has # in the title', (t) => {
  const input: Category[] = [
    {
      id: 1,
      Title: '#1',
      children: [],
    } as Category,
    {
      id: 2,
      Title: '2',
      children: [],
    } as Category,
  ];

  t.deepEqual(
    buildCategoryTree(input).map((c) => c.showOnHome),
    [true, true]
  );
});

test('buildCategoryTree() returns first 3 categories as home categories when more then 5 categories', (t) => {
  const input: Category[] = [
    {
      id: 1,
      Title: '1',
      children: [],
    } as Category,
    {
      id: 2,
      Title: '2',
      children: [],
    } as Category,
    {
      id: 3,
      Title: '3',
      children: [],
    } as Category,
    {
      id: 4,
      Title: '4',
      children: [],
    } as Category,
    {
      id: 5,
      Title: '5',
      children: [],
    } as Category,
    {
      id: 6,
      Title: '6',
      children: [],
    } as Category,
  ];

  t.deepEqual(
    buildCategoryTree(input).map((c) => c.showOnHome),
    [true, true, true, false, false, false]
  );
});

test('buildCategoryTree() returns only categories with # as home categories', (t) => {
  const input: Category[] = [
    {
      id: 1,
      Title: '1',
      children: [],
    } as Category,
    {
      id: 2,
      Title: '2',
      children: [],
    } as Category,
    {
      id: 3,
      Title: '3#',
      children: [],
    } as Category,
    {
      id: 4,
      Title: '4#',
      children: [],
    } as Category,
    {
      id: 5,
      Title: '5',
      children: [],
    } as Category,
    {
      id: 6,
      Title: '6',
      children: [],
    } as Category,
  ];

  t.deepEqual(
    buildCategoryTree(input).map((c) => c.showOnHome),
    [false, false, true, true, false, false]
  );
});

test('buildCategoryList() is sorted by order', (t) => {
  const input: Category[] = [
    {
      id: 200,
      Title: 'last',
      name: 'A',
      children: [],
    } as Category,
    {
      id: 201,
      Title: '1',
      name: 'B',
      children: [],
    } as Category,
    {
      id: 100,
      Title: '3#',
      name: 'C',
      children: [],
    } as Category,
    {
      id: 101,
      Title: '2',
      name: 'D',
      children: [],
    } as Category,
  ];

  t.deepEqual(
    buildCategoryTree(input).map((c) => c.name),
    ['B', 'D', 'C', 'A']
  );
});

test('buildCategoryListElement() returns CategoryListElement with no children', (t) => {
  const input: Category = {
    id: 9327,
    name: 'Świece',
    hasChildren: false,
    url: 'https://exampledataprovider.com/porządki/powiew-świeżości/świece',
    children: [],
    Title: '2',
    MetaTagDescription: 'Świece',
  };

  const expected = {
    id: 9327,
    image: 'Świece',
    name: 'Świece',
    order: 2,
    children: [],
    showOnHome: false,
  };

  t.deepEqual(buildCategoryListElement(input), expected);
});

test('CategoryUtils: getOrder() returns order from Title, if Title is a number', (t) => {
  const category = {
    id: 9327,
    Title: '2',
  } as Category;
  t.is(CategoryUtils.getOrder(category), 2);
});

test('CategoryUtils: getOrder() returns id as order, if Title is not a number', (t) => {
  const category = {
    id: 9327,
    Title: 'Swiece',
  } as Category;
  t.is(CategoryUtils.getOrder(category), 9327);
});

test('CategoryUtils: getOrder() returns order from Title, if Title is a number with #', (t) => {
  const category = {
    id: 9327,
    Title: '2#',
  } as Category;
  t.is(CategoryUtils.getOrder(category), 2);
});

test('CategoryUtils: getImage() returns custom image url if children.length > 0', (t) => {
  const category = {
    id: 9327,
    children: [{ id: 9328 }],
    url: 'https://exampledataprovider.com/porządki/powiew-świeżości/świece',
    MetaTagDescription: 'Świece',
  } as Category;
  t.is(
    CategoryUtils.getImage(category),
    'https://anotherprovider.com/categories/swiece.jpg'
  );
});

test('CategoryUtils: getImage() returns MetaTagDescription if no children', (t) => {
  const category = {
    id: 9327,
    children: [],
    url: 'https://exampledataprovider.com/porządki/powiew-świeżości/świece',
    MetaTagDescription: 'Świece',
  } as Category;
  t.is(CategoryUtils.getImage(category), 'Świece');
});

test('CategoryUtils: isHomeCategory() returns true for category with # in the title', (t) => {
  const category = {
    id: 9327,
    Title: '2#',
  } as Category;
  t.is(CategoryUtils.isHomeCategory(category), true);
});

test('CategoryUtils: isHomeCategory() returns false for category without # in the title', (t) => {
  const category = {
    id: 9327,
    Title: 'inpostjestfajny',
  } as Category;
  t.is(CategoryUtils.isHomeCategory(category), false);
});

test('UrlUtils: converts given url to custom url format', (t) => {
  const url =
    'https://exampledataprovider.com/porządki/powiew-świeżości/świece';
  const newDomain = 'https://anotherprovider.com';
  const ex = 'png';
  t.is(
    UrlUtils.handleImageUrl(url, newDomain, ex),
    'https://anotherprovider.com/categories/swiece.png'
  );
});

test('UrlUtils: converts given url to custom url format with test domain', (t) => {
  const url =
    'https://exampledataprovider.com/porządki/powiew-świeżości/świece';
  t.is(
    UrlUtils.handleImageUrl(url),
    'https://testprovider.com/categories/swiece.jpg'
  );
});

test('UrlUtils: replaceUrlDomain returns empty string if no url provided', (t) => {
  const url = 'inpostjestfajny';
  t.is(UrlUtils.handleImageUrl(url), '');
});
