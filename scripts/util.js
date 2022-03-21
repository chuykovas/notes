/**
 *
 * @param {string} tag -  HTML-тег элемента
 * @param {Object} {attributes} - объект атрибутов элемента
 * @param
 */

export function createElement(tag, attributes) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach(key => {
      if (tag === 'div' && key === 'placeholder') {
        element.setAttribute(key, attributes[key])
      } else {
        element[key] = attributes[key];
      }
    });
  }

  return element;
}

export function getDate(date) {
  const dateNow = new Date(date);

  return `${dateNow.toLocaleDateString()} ${dateNow.toLocaleTimeString()}`;
}

/**
 *
 * @param input
 * @returns {*}
 */

export function getBase64(file, callback) {

  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result));

  reader.readAsDataURL(file);
}

/**
 *
 * @param key
 * @param order
 * @returns {function(*, *): number|number}
 */
export function compare(key, order = 'ascending') {
  return function (a, b) {
    const firstName = a.state[key];
    const secondName = b.state[key];

    if (firstName.typeof === 'string' && secondName.typeof === 'string') {
      firstName = firstName.toUpperCase();
      secondName = secondName.toUpperCase();
    }

    let comparison = 0;

    if (firstName > secondName) {
      comparison = 1;
    } else if (firstName < secondName) {
      comparison = -1;
    }

    return order === 'descending' ? comparison * -1 : comparison;
  }
}
