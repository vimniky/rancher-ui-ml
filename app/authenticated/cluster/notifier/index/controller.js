import { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  modalService: service('modal'),
  globalStore: service(),

  queryParams: ['type'],
  type: 'all',
  notifiers: alias('model.notifiers'),

  init(...args) {
    this._super(...args);
    const globalStore = get(this, 'globalStore')
    // set(this, 'notifiers', notifiers)
  },

  fetch() {
    get(this, 'globalStore').findAll('notifier', {forceReload: true}).then(data => {
      set(this, 'notifiers', data);
    });
  },
  currentType: 'slack',
  actions: {
    showNewEditModal() {
      this.get('modalService').toggleModal('notifier/modal-new-edit', {
        closeWithOutsideClick: false,
        callback: get(this, 'fetch').bind(this),
        controller: this,
      });
    },
  },
});
