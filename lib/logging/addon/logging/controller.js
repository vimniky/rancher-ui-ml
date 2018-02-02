import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed';

export default Controller.extend({
  globalStore: service(),

  queryParams: ['targetType'],
  targetType: 'none',
  logging: alias('model.logging'),

  init(...args) {
    this._super(...args);
  },

  didReceiveAttrs() {
    const logging = this.get('model.logging');
    set(this, 'targetType', logging.targetType);
  },

});
