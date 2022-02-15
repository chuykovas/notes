/**
 *
 * @param {string} type - тип элемента
 * @param {Array.<{name: String, value: String}>} [attributes] - массив атрибутов элемента
 */

export function createElement(type, ...attributes) {
  const element = document.createElement(type);
  for(let attribute of attributes) {
      element[attribute.name] = attribute.value;
  }
  return element;
}