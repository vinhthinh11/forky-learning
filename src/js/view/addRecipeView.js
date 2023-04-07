import { RESULT_PER_PAGE } from '../config';
import View from './View';
import icon from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _currentPage = 1;
  _message = 'Recipe was successfully uploaded :)';
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }
  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHanlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _renderMarkup() {}
}
export default new AddRecipeView();
