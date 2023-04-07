import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './view/recipeView.js';
import { async } from 'regenerator-runtime';
import searchRecipe from './view/searchView.js';
import bookmarkView from './view/bookmarkView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2
// 5ed6604591c37cdc054bcac4
// 5ed6604591c37cdc054bcc40

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

// fecch API ve may

async function controlRecipe() {
  // get Id from addressbar
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmark);
    // 1. call module.js to fetch data
    await model.loadRecipe(id);
    recipeView._render(model.state.recipe);

    // 2. Rendering recipe
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
}
const controlSearchRecipe = async function () {
  resultsView.renderSpinner();
  const query = searchRecipe.getQuery();
  if (!query) return;
  await model.loadSearchResults(query);
  resultsView._render(model.getSearchResultPage(model.state.search.currPg));
  paginationView._render(model.state.search);
  console.log(model.state.search.result);
};

const controlPagination = function (isNext) {
  isNext ? model.state.search.currPg++ : model.state.search.currPg--;
  resultsView._render(model.getSearchResultPage(model.state.search.currPg));
  paginationView._render(model.state.search);
};
const controlServings = function (number) {
  // 0. update result view to mark result view
  resultsView.update(model.getSearchResultPage());
  // 1. Updating serving (state.recipe)
  model.updateServings(number);
  // 2. Update recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //add or remove bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update recipte view
  recipeView.update(model.state.recipe);
  // 3. Render bookmark
  bookmarkView._render(model.state.bookmark);
};
const controlBookmark = function () {
  bookmarkView._render(model.state.bookmark);
};
const controlAddRecipe = async function (recipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipe);
    //render uploaded recipe
    recipeView._render(model.state.recipe);
    // close upload form
    addRecipeView.renderMessage();
    // render bookmark view
    bookmarkView._render(model.state.bookmark);
    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🛺🛺🛺', err);
    addRecipeView.renderError(err.message);
  }
  //Upload new recipe data
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchRecipe.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHanlerUpload(controlAddRecipe);
};
// addEventListener to hashchange
// window.addEventListener('hashchange', showRecipe);
// loop for 2 action when page is loaded and hashchange
init(); //chay init() o lan dau, gans cac listener cho window thi address bar thay doi dia chi thi control cung thay doi theo => reder ra hinh anh tuong ung
