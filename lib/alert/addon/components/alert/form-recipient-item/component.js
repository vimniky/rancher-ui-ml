import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';

import Component from '@ember/component';

export default Component.extend({
  useDefault: true,

  selectedNotifier: function() {
    return get(this, 'notifiers').filterBy('id', get(this, 'model.notifierId')).get('firstObject');
  }.property('model.notifierId', 'notifiers.[]'),

  setRecipient: function() {
    const v = get(this, 'selectedNotifier.notifierValue');
    set(this, 'model.recipient', v);
  }.observes('selectedNotifier.notifierValue'),

  actions: {
    toggleUseDefault() {
      this.toggleProperty('useDefault');
    },
    remove() {
      this.sendAction('remove', get(this, 'model'));
    },
  },
});
