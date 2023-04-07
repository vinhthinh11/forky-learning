import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULT_PER_PAGE } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  //state is a place to store display recipe and query, search result
  recipe: {},
  search: { query: '', result: [], resultPerPage: RESULT_PER_PAGE, currPg: 1 },
  bookmark: [],
};
const createRecipe = function (data) {
  const { recipe } = data.data; //detructure object
  //tao moi oject thay property _ co under socre
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  //get recipe from forkify api
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    // const res = await fetch(`${API_URL}/${id}`);
    // const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message} status: ${res.status}`);
    state.recipe = createRecipe(data);

    if (state.bookmark.some(recipe => recipe.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}🏴‍☠️🏴‍☠️🏴‍☠️🏴‍☠️🏴‍☠️🏴‍☠️`);
    throw err;
  }
};
//https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
export const loadSearchResults = async function (query) {
  const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
  state.search.result = data.data.recipes.map(rec => {
    return {
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }),
    };
  });
  state.search.query = query;
  state.search.currPg = 1;
};
export const getSearchResultPage = function (page = state.search.currPg) {
  state.search.currPg = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};
export const updateServings = function (number) {
  const oldServing = state.recipe.servings;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * number) / oldServing;
  });
  state.recipe.servings = number;
};
export const addBookmark = function (recipie) {
  if (!recipie) return;
  state.bookmark.push(recipie);
  // mark current recipe bookmarked
  if (recipie.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};
export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};
const persistBookmark = function (e) {
  localStorage.setItem('boookmarkRecipe', JSON.stringify(state.bookmark));
};
const init = function () {
  const storage = localStorage.getItem('boookmarkRecipe');
  if (!storage) return;
  state.bookmark = JSON.parse(storage);
};
init();
const clearBookmark = function () {
  localStorage.clear('boookmarkRecipe');
};
export const uploadRecipe = async function (newRecipe) {
  console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entri => entri[0].startsWith('ingredient') && entri[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format. Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
