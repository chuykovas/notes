/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/category.js":
/*!*****************************!*\
  !*** ./scripts/category.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./scripts/util.js");


function Category(params) {
  this.onDelete = params.onDelete;
  this.state = {
    title: params.title,
    notes: [],
  };

  this.htmlContainer = this.render();

}

function handlerClickEdit() {

}

Category.prototype.delete = function () {
  this.htmlContainer.remove();

}

Category.prototype.rename = function (newName) {
  this.state.title = newName;
  this.htmlContainer = this.render();
}

Category.prototype.render = function () {
  const category = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {name: 'className', value: 'category'});
  const categoryTitle = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {name: 'className', value: 'category-title'},
                                            {name: 'textContent', value: this.state.title});
  const noteCount = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {name: 'className', value: 'notes-count'},
                                       {name: 'textContent', value: this.state.notes.length || 0});
  const menuButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {name: 'className', value: 'kebab-menu-button'},
                                             {name: 'onclick', value: () => kebabMenu.classList.toggle('active')});

  const kebabMenu = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('ul', {name: 'className', value: 'kebab-menu'});
  const kebabMenuButtonEdit = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {name: 'className', value: 'kebab-menu-item'},
                                                  {name: 'textContent', value: 'Редактировать'});
  const kebabMenuButtonDelete = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {name: 'className', value: 'kebab-menu-item'},
                                                    {name: 'textContent', value: 'Удалить'},
                                                    {name: 'onclick', value: () => this.delete()});

  kebabMenu.append(kebabMenuButtonEdit, kebabMenuButtonDelete);

  category.append(categoryTitle, noteCount, menuButton,kebabMenu);

  return category;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Category);

/***/ }),

/***/ "./scripts/util.js":
/*!*************************!*\
  !*** ./scripts/util.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* binding */ createElement)
/* harmony export */ });
/**
 *
 * @param {string} type - тип элемента
 * @param {Array.<{name: String, value: String}>} [attributes] - массив атрибутов элемента
 */

function createElement(type, ...attributes) {
  const element = document.createElement(type);
  for(let attribute of attributes) {
      element[attribute.name] = attribute.value;
  }
  return element;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./scripts/app.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./category */ "./scripts/category.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./scripts/util.js");





const categoryList = document.querySelector('.category-list_content');
const categoryItem = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]({title: 'Короткие заметки'});
categoryList.append(categoryItem.htmlContainer);
//
// const addCategoryButton = document.querySelector('.add-category-button');
// const categoryList = document.querySelector('.category-list_content');
//
// const defaultCategory = new Category('Без категории');
// categoryList.append(defaultCategory.createCategory());
//
//
// addCategoryButton.addEventListener('click', () => {
//     const category = new Category();
//     categoryList.append(category.createCategory());
// })



})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map