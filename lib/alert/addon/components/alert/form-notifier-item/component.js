import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

import Component from '@ember/component';

export default Component.extend({
  notifierId: null,
  useDefault: true,
  recipientId: null,

  selectedNotifier: function() {
    return get(this, 'notifiers').filterBy('id', get(this, 'notifierId')).get('firstObject');
  }.property('notifierId', 'notifiers.[]'),

  // groupedNotifiers: function() {
  //   const ns = get(this, 'notifiers');
  //   return groupBy(ns, n => n.notifierType);
  // }.property('notifiers'),

  actions: {
    toggleUseDefault() {
      this.toggleProperty('useDefault');
    },
    remove() {
      this.sendAction('remove', get(this, 'model'));
    },
  },
});
