import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

export default Controller.extend({

  access: service(),
  modalService: service('modal'),

  sortBy: 'name',
  queryParams: ['alertState'],
  alertState: 'all',
  alerts: alias('model.alerts'),

  actions: {
  }
});
