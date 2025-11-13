/**
 * @file
 * Drag-and-drop для DraggableViews в форматах списка.
 */
(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.draggableviewsUl = {
    attach(context) {
      const forms = once('draggableviews-ul', '.draggableviews-ul-form', context);

      forms.forEach((form) => {
        // Если внутри есть таблица, значит это table-формат — его не трогаем.
        if (form.querySelector('.views-table')) {
          return;
        }

        // Контейнер с результатами view:
        //  - для HTML List это <div class="view-content"><ul>...</ul></div>
        //  - для Неформатованного списка — <div class="view-content"><div class="views-row">...</div>...</div>
        const container =
          form.querySelector('.view-content > ul') ||
          form.querySelector('.view-content');

        if (!container) {
          return;
        }

        if (typeof Sortable === 'undefined') {
          return;
        }

        Sortable.create(container, {
          group: form.getAttribute('id') || 'draggableviews-ul',
          draggable: '.views-row',
          onSort() {
            // Пере-нумеруем скрытые weight-поля DraggableViews.
            const weights = container.querySelectorAll('input.draggableviews-weight');

            Array.prototype.forEach.call(weights, (input, index) => {
              input.value = index;
            });

            // Если DraggableViews настроен на авто-сохранение через кнопку —
            // триггерим её.
            const autosave = form.querySelector('.js-draggableviews-save-order');
            if (autosave) {
              const evt = new Event('mousedown', { bubbles: true });
              autosave.dispatchEvent(evt);
            }
          },
        });
      });
    },
  };
})(Drupal, once);
