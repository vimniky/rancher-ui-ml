import Component from '@ember/component'
import {alias} from '@ember/object/computed'
import ModalBase from 'ui/mixins/modal-base';
import layout from './template'

export default Component.extend(ModalBase, {
  layout,

  classNames: ['generic', 'large-modal'],
  model: alias('modalService.modalOpts.model'),
  currentType: 'slack',

  errors: null,

  init(...args) {
    this._super(...args);

    const model = {
      name: 'xxx',
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
    }

    this.set('model', model);

    const types = [
      {
        type: 'slack',
        label: '',
        disabled: false,
      },
      {
        type: 'email',
        label: '',
        css: 'email',
        disabled: false,
      },
      {
        type: 'pagerduty',
        disabled: false,
      },
      {
        type: 'webhook',
        disabled: false,
      },
    ];

    this.set('types', types)
  },

  validate() {
    const errors = this.get('model').validationErrors();
    if (errors.get('length')) {
      this.set('errors', errors);
      return false;
    }
    this.set('errors', null);
    return true;
  },

  actions: {
    switchType(type) {
      this.set('currentType', type)
    },
    save(cb) {
      const ok = this.validate();
      if (!ok) {
        cb();
        return;
      }
      const model = this.get('model');
      model.save().then(newData => {
        model.merge(newData);
        this.get('modalService').toggleModal();
      }).catch(error => {
        this.set('errors', [error && error.message]);
      }).finally(() => {
        cb();
      });
    },
  },
});
