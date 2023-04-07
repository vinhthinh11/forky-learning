import { RESULT_PER_PAGE } from '../config';
import View from './View';
import icon from 'url:../../img/icons.svg';

class PaginationView extends View {
  _currentPage = 1;
  _parentElement = document.querySelector('.pagination');
  _renderMarkup() {
    const totalPage = Math.ceil(this._data.result.length / RESULT_PER_PAGE);
    //ruong hop o trang dau tien ma co 1 trang
    if (this._data.currPg === 1 && totalPage === 1) return ``;
    // truong hop o trang dau tien ma co 2 trang tro len
    if (this._data.currPg === 1 && totalPage !== 1)
      return ` <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.currPg + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>`;
    if (this._data.currPg === totalPage)
      //truong hop cuoi trang
      return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currPg - 1}</span>
          </button>`;
    if (this._data.currPg < totalPage)
      return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currPg - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.currPg + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const isNextPage = btn.classList.contains('pagination__btn--next');
      handler(isNextPage);
    });
  }
}
export default new PaginationView();

/* <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page 1</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page 3</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button> */
