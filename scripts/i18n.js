import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    en: {
      translation: {
        "inputNameNewCategory": "New category",
        "newNote": "New note",
        "searchInput": "Search by notes",
        "kebabMenu": {
          "editButton": "Edit",
          "deleteButton": "Delete"
        },
        "noteContent": {
          "titleNote": "Title note",
          "textNote": "Text note"
        }
      }
    },
    ru: {
      translation: {
        "inputNameNewCategory": "Новая категория",
        "newNote": "Новая заметка",
        "searchInput": "Поиск по категориям",
        "kebabMenu": {
          "editButton": "Редактировать",
          "deleteButton": "Удалить"
        },
        "noteContent": {
          "titleNote": "Название заметки",
          "textNote": "Текст заметки"
        }
      }
    }
  }
}, function (err, t) {
  updateContent();
});

function updateContent() {
  document.getElementById('inputNameNewCategory').innerHTML = i18next.t('inputNameNewCategory');
  document.getElementById('searchInput').innerHTML = i18next.t('searchInput');
  document.getElementById('newNote').innerHTML = i18next.t('newNote');
}

function changeLng(lng) {
  i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
  updateContent();
});