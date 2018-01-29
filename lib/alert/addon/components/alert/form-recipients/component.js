import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
  },

  addNewRecipient() {
    const nue = {
      customPagerdutyConfig: {
      },
      customWebhookConfig: {
      },
      notifierId: null,
      recipient: null,
    };
    get(this, 'newAlert.recipients').pushObject(nue);
  },

  disableRemove: function() {
    return get(this, 'newAlert.recipients') <= 1;
  }.property('newAlert.recipients.length'),

  actions: {
    add() {
      this.addNewRecipient();
    },
    remove(recipient) {
      get(this, 'newAlert.recipients').removeObject(recipient);
    },
  },
});
