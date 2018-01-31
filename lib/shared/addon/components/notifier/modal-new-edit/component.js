import Component from '@ember/component';
import {alias} from '@ember/object/computed';
import ModalBase from 'ui/mixins/modal-base';
import layout from './template';
import { get, set } from '@ember/object'
import { inject as service } from '@ember/service';

export default Component.extend(ModalBase, {
  layout,
  globalStore: service(),

  classNames: ['generic', 'large-modal'],
  model: alias('modalService.modalOpts.model'),
  currentType: 'slack',

  errors: null,

  init(...args) {
    this._super(...args);
    const opt = {
      type: 'notifier',
      name: null,
      description: null,
      slackConfig: {
        "webhookURL": null,
        "channel": null,
      },
      // emailConfig: {
      //   "smtpHost": null,
      //   "smtpPort": null,
      //   "smtpUsername": null,
      //   "smtpPassword": null,
      //   "receiver": null,
      //   "requireTLS":true
      // },
      // pagerdutyConfig: {
      //   "serviceKey": null,
      // },
      // webhookConfig: {
      //   "url": null,
      // },
    }
    const model = get(this, 'globalStore').createRecord(opt);

    this.set('model', model);

    const types = [
      {
        type: 'slack',
        label: 'Slack',
        disabled: false,
      },
      {
        type: 'email',
        label: 'Email',
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
        label: 'Webhook',
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
    test(cb) {
      setTimeout(() => cb(true), 500);
    },
    save(cb) {
      console.log('------notifier', get(this, 'model'));
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
