import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
    if (!get(this, 'notifiers')) {
      set(this, 'notifiers', []);
    }

    const newNotifiers = [
      {notifierId: null, recipientId: null},
    ];
    set(this, 'newNotifiers', newNotifiers);
  },

  disableRemove: function() {
    return get(this, 'newNotifiers.length') <= 1;
  }.property('newNotifiers.length'),

  actions: {
    add() {
      const newNotifiers = get(this, 'newNotifiers');
      newNotifiers.pushObject({notifierId: null, recipientId: null});
    },
    remove(notifier) {
      get(this, 'newNotifiers').removeObject(notifier);
    },
  },
});
