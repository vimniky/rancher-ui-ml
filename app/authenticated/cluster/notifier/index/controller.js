import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
  modalService: service('modal'),
  globalStore: service(),

  queryParams: ['type'],
  type: 'all',

  init(...args) {
    this._super(...args);
    const globalStore = get(this, 'globalStore')
    const notifiers = [
      {
        actions: {},
        availableActions: [],
        name: 'notifier-1',
        type: 'notifier',
        description: null,
        slackConfig: {
          "webhookURL":"slack.com/xxx",
          "channel": "#test",
        },
        emailConfig: {
          "smtpHost":"192.168.1.121",
          "smtpPort":"465",
          "smtpUsername":"admin",
          "smtpPassword":"admin",
          "receiver":"admin@test.com",
          "requireTLS":true
        },
        pagerdutyConfig: {
          "serviceKey":"xxxxx",
        },
        webhookConfig: {
          "url":"xxxxx",
        },
      },
    ];
    // set(this, 'notifiers', notifiers)
  },

  actions: {
    showNewEditModal() {
      this.get('modalService').toggleModal('notifier/modal-new-edit', {
        closeWithOutsideClick: false,
        // model: this.get('model'),
      });
    },
  },
});
