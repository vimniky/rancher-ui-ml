import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'

export default Controller.extend({
  globalStore: service(),

  queryParams: ['targetType'],
  targetType: 'elasticsearch',
  logging: null,

  init() {
    const logging = get(this, 'globalStore').createRecord({
      type: 'logging',
      targetType: 'elasticsearch',
    })
    set(this, 'logging', logging)
  },

  targetTypeChanged: function() {
    const l = this.get('logging');
    const t = this.get('targetType');
    if (l && l.get('targetType') !== t) {
      l.set('targetType', t);
    }
  }.observes('targetType', 'logging.targetType'),

});
