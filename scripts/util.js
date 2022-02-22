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
