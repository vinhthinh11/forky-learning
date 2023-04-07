class SearchRecipe {
  #parentEle = document.querySelector('.search');
  getQuery() {
    const query = this.#parentEle.querySelector('.search__field').value;
    this.clearInpt();
    return query;
  }
  clearInpt() {
    this.#parentEle.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this.#parentEle.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchRecipe();
