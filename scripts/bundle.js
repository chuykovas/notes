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
function Category(title) {
    this.title = title;

    this.render = function () {
        const category = document.createElement('div');
        category.classList.add('category');

        if(!this.title) {
            category.innerHTML = `
            <input type="text" placeholder="Название" class="add-name-input"/>
            <button class="add-name-category-button"></button>
            `;
        }
        category.addEventListener('click', event => {
            const clickedElement = event.target;

            if(clickedElement.tagName === 'BUTTON') {
                this.title = clickedElement.previousElementSibling.value || 'Без названия';
                category.innerHTML = `
                    <h3 class="category-title">${this.title}</h3>
                    <p class="notes-count">Заметок: <span>0</span></p>
                `;
            }
        })
        return category;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Category);

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


const addCategoryButton = document.querySelector('.add-category-button');
const categoryList = document.querySelector('.category-list_content');

const defaultCategory = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]('Без категории');
categoryList.append(defaultCategory.render());


addCategoryButton.addEventListener('click', () => {
    const category = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]();
    categoryList.append(category.render());
})
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map