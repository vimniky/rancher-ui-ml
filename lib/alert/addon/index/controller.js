import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'

export default Controller.extend({

  access: service(),
  modalService: service('modal'),

  sortBy: 'name',
  queryParams: ['alertState'],
  alertState: 'all',

  actions: {
    showConfigureModal() {
      this.get('modalService').toggleModal('modal-alert-configuration', {
        closeWithOutsideClick: false,
        model: this.get('model.notifier'),
      });
    },
  }
});
