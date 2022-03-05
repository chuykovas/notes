/**
 *
 * @param {string} tag -  HTML-тег элемента
 * @param {Object} {attributes} - объект атрибутов элемента
 * @param
 */

export function createElement(tag, attributes) {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach(key => element[key] = attributes[key]);

  return element;
}

export function getDate() {
  const dateNow = new Date();

  return `${dateNow.toLocaleDateString()} ${dateNow.toLocaleTimeString()}`;
}

/**
 *
 * @param input
 * @returns {*}
 */
export function loadPicture(input) {
  let data;
  const reader = new FileReader();
  reader.readAsDataURL(input.files[0]);
  reader.onload = function () {
    data = reader.result;
  }
  return data;
}

/**
 *
 * @param key
 * @param order
 * @returns {function(*, *): number|number}
 */
export function compare(key, order = 'ascending') {
  return function (a, b) {
    const firstName = a.state[key].toUpperCase();
    const secondName = b.state[key].toUpperCase();
    let comparison = 0;

    if (firstName > secondName) {
      comparison = 1;
    } else if (firstName < secondName) {
      comparison = -1;
    }

    return order === 'descending' ? comparison * -1 : comparison;
  }
}
