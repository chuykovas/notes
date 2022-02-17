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
  const popupInputText = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: 'Введите название'
  });
  const acceptButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'popup-button', onclick: (event) => {
      event.preventDefault();
      this.rename(popupInputText.value || this.state.title);
      popupWrapper.remove();
    }
  }, 'Принять');
  const cancelButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'popup-button',
    onclick: (event) => {
      event.preventDefault();
      popupWrapper.remove();
    }
  }, 'Отменить');
  const popup = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('form', {className: 'popup-form'}, popupInputText, acceptButton, cancelButton);
  const popupWrapper = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {className: 'popup-wrapper'}, popup);

  document.body.append(popupWrapper);
}

Category.prototype.delete = function () {
  this.htmlContainer.remove();
}

Category.prototype.rename = function (newName) {
  this.state.title = newName;
  this.htmlContainer.firstChild.textContent = this.state.title;
}

Category.prototype.render = function () {

  const categoryTitle = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {className: 'category-title'}, this.state.title);
  const noteCount = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {className: 'notes-count'}, String(this.state.notes.length));
  const menuButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'kebab-menu-button',
    onclick: () => kebabMenu.classList.toggle('active')
  });
  const kebabMenuButtonEdit = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
    className: 'kebab-menu-item',
    onclick: () => handlerClickEdit.bind(this)()
  }, 'Редактировать');
  const kebabMenuButtonDelete = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
    className: 'kebab-menu-item',
    onclick: () => this.delete()
  }, 'Удалить');
  const kebabMenu = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('ul', {className: 'kebab-menu'}, kebabMenuButtonEdit, kebabMenuButtonDelete);

  const category = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'category',
    onclick: () => category.classList.toggle('checked')
  }, categoryTitle, noteCount, menuButton, kebabMenu);

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
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
/**
 *
 * @param {string} tag -  HTML-тег элемента
 * @param {Object} {attributes} - объект атрибутов элемента
 * @param
 */

function createElement(tag, attributes, ...children) {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach(key => element[key] = attributes[key]);

  if(children.length > 0){
    children.forEach(child => {
      if(typeof child === 'string'){
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    });
  }
  return element;
}

function EventEmitter() {
  this.events = {};
  this.on = function (type, callback) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(callback);
  };

  this.emit = function (type, arg) {
    if(this.events[type]) {
      this.events[type].forEach(callback => callback(arg));
    }

  };
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
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./category */ "./scripts/category.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./scripts/util.js");



function App() {
    this.state = {
        categories: [],
    }
}

App.prototype.render = function () {
    const addCategoryButton = document.querySelector('.add-button');
    const addCategoryInput = document.querySelector('.add-category-input');

    const categoryList = document.querySelector('.category-list_content');
    const categoryItem = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]({title: 'Короткие заметки'});
    categoryList.append(categoryItem.htmlContainer);

    addCategoryButton.addEventListener('click', (event) => {
        event.preventDefault();
        const category = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]({title: addCategoryInput.value});
        categoryList.append(category.htmlContainer);
        this.state.categories.push(category.htmlContainer);
        addCategoryInput.value = '';
        console.log(this.state.categories);
    });
}

new App().render();





})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map