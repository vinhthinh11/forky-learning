import icon from 'url:../../img/icons.svg';
export default class View {
  _data;
  /**
   * Render the html markup to dislay on page
   * @param {Object|object[]} data The data to be rendered to the page (e.g recipe)
   * @param {boolean} render If false create a markup string instead render to the dom
   * @returns {undefined|string}  If the render = False return a string of markup
   */
  _render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._renderMarkup();
    if (!render) return this._renderMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._renderMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // ListNode ao tren dom
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //list node thuc the
    const currentElement = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((newEl, i) => {
      const curEl = currentElement[i];
      // Update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // update change attribute
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = ` 
      <div class="spinner">
          <svg>
            <use href="${icon}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = ` <div class="message">
          <div>
            <svg>
              <use href="${icon}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icon}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
