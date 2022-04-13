<h1 align="center">NOTES</h1>
<h2 align="center">
</h2>
<p>Notes - приложение для создания заметок.</p>
<p align="center">
<img src="assets/Снимок экрана от 2022-04-13 09-18-49.png">
</p>

## Описание

Notes - простое приложение для создания и редактирования заметок. Создан на JavaScript, паттерн проектирования - MVS, хранение данных на стороне клиента - IndexedDB.

## Демонстрация работы

### Создание категорий и заметок
<p align="center">
<img src="assets/create.gif" width="100%"></p>

### Редактирование заметок
<p align="center">
<img src="assets/edit-notes.gif" width="100%"></p>

### Поиск и сортировка
<p align="center">
<img src="assets/search.gif" width="100%"></p>

## О проекте

### Добавление картинок

Для добавления картинок использовался глобальный объект JavaScript FileReader, который позволяет читать данные из Blob:
```JavaScript
reader.readAsDataURL(file);
```
### Хранение данных о категориях и заметках
Данные хранятся на стороне клиента в базе данных IndexedDB. Компоненты для работы с базой данных лежат в scripts/store.
Модуль store.js отвечает за хранение общего состояния приложения и импортирует IndexedDB.
Модуль indexedDB.js определяет класс IndexedDB с конструктором и возвращает объект после успешного подключения к базе.

## Настройка проекта

```
npm install
npx webpack
```
