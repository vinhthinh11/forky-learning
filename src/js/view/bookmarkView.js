import View from './View';
import PreviewView from './previewView.js';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmark found for your query. Please try again!`;
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _renderMarkup() {
    console.log(this._data);
    return this._data
      .map(result => PreviewView._render(result, false))
      .join('');
  }
}
export default new BookmarkView();
