/**
 *
 * @param {string} tag -  HTML-тег элемента
 * @param {Object} {attributes} - объект атрибутов элемента
 * @param
 */

export function createElement(tag, attributes, ...children) {
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

export function EventEmitter() {
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