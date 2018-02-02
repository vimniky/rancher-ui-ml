import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import ModalBase from 'ui/mixins/modal-base';
import layout from './template';
import { get, set } from '@ember/object'
import { inject as service } from '@ember/service';


export default Component.extend(ModalBase, {
  layout,
  scope: service('scope'),
  globalStore: service(),
  cluster: alias('scope.currentCluster'),

  classNames: ['generic', 'large-modal'],
  currentType: alias('modalService.modalOpts.controller.currentType'),

  modelMap: null,
  errors: null,

  setModel(type, config = {}) {
    const cachedModel = get(this, `modelMap.${type}`);
    if (cachedModel) {
      set(this, 'model', cachedModel);
      return;
    }
    const opt = {
      type: 'notifier',
      displayName: null,
      description: null,
      clusterId: get(this, 'cluster.id'),
      [`${type}Config`]: config,
    };
    const model = get(this, 'globalStore').createRecord(opt);
    set(this, 'model', model);
    set(this, `modelMap.${type}`, model);
  },

  init(...args) {
    this._super(...args);
    set(this, 'modelMap', {});
    this.setModel(get(this, 'currentType'));
    const types = [
      {
        type: 'slack',
        label: 'Slack',
        disabled: false,
      },
      {
        type: 'smtp',
        label: 'Email',
        css: 'email',
        disabled: false,
      },
      {
        label: '',
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
      this.set('currentType', type);
      this.setModel(type);
      console.log('---------', get(this, 'model'));
      console.log('---------amp', get(this, 'modelMap'));
    },
    test(cb) {
      setTimeout(() => cb(true), 500);
    },
    save(cb) {
      const ok = this.validate();
      if (!ok) {
        cb();
        return;
      }
      const model = this.get('model');

      console.log('------------notifier', model);
      model.save().then(newData => {
        model.merge(newData);
        get(this, 'modalService').toggleModal();
      }).catch(error => {
        console.log(error)
        this.set('errors', [error && error.message]);
      }).finally(opt => {
        console.log(opt)
        cb();
      });
    },
  },
});
