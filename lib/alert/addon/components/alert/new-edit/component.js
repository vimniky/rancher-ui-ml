import EmberObject from '@ember/object';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { get, set } from '@ember/object'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { inject as service } from '@ember/service'

const SEVERITIES = [
  {label: 'info', value: 'info'},
  {label: 'critical', value: 'critical'},
  {label: 'warning', value: 'warning'},
];

export default Component.extend(NewOrEdit, {
  router: service(),
  intl: service(),
  globalStore: service(),
  pageScope: reads('scope.currentPageScope'),
  project: reads('scope.currentProject'),
  cluster: reads('scope.currentCluster'),
  scope: service(),
  namespace: reads('projects.namespace'),

  originalModel: null,
  advancedShown: false,
  errors: null,
  pods: null,
  workloads: null,
  severity: 'info',
  newAlert: null,

  init() {
    this._super(...arguments);
    this.set('severities', SEVERITIES);
    set(this, 'model', EmberObject.create({
      advancedOptions: {},
    }));
    this.createNewAlert();
  },

  createNewAlert() {
    const ps = get(this, 'pageScope');
    const gs = get(this, 'globalStore');
    const defaultRecipient = {
      customPagerdutyConfig: {
      },
      customWebhookConfig: {
      },
      notifierId: null,
      recipient: null,
    };
    const opt = {
      displayName: '',
      recipients: [
        defaultRecipient,
      ],
      targetPod: {
        condition: null,
        restartTimes: 3,
      },
      targetWorkload: {
        selector: {},
        unavailablePercentage: 30,
      },
    };
    if (ps === 'project') {
      opt.type = 'projectAlert'
      opt.projectId = get(this, 'project.id');
    }
    if (ps === 'cluster') {
      opt.type = 'clusterAlert'
      opt.projectId = get(this, 'cluster.id');
    }
    const alert = gs.createRecord(opt);
    set(this, 'newAlert', alert);
  },
  didReceiveAttrs() {
    // const original = this.get('originalModel');
    // if (!original) {
    //   this.addAlert();
    //   return;
    // }
    // this.set('model', original.clone());
  },

  mergeResult(newData) {
    const original = this.get('originalModel');
    if (original) {
      // Merge updated data to original model
      original.merge(newData);
      return original;
    }
    return newData;
  },
  validate(model) {
    const errors = model.validationErrors();
    if (errors.get('length')) {
      this.set('errors', errors);
      return false;
    }
    this.set('errors', null);
    return true;
  },
  willSave() {
    const alert = this.get('model');
    return this.validate(alert);
  },
  doSave(cb) {
    const alert = this.get('model');
    alert.save().then((alertData) => {
      this.mergeResult(alertData);
      this.doneSaving();
      cb();
    }).catch(err => {
      this.set('errors', [err]);
      cb();
    });
  },
  doneSaving: function() {
    return this.send('cancel');
  },
  addAlert() {
  },
  actions: {
    showAdvanced() {
      this.set('advancedShown', true);
    },
    save(cb) {
      console.log(get(this, 'newAlert'));
      cb(true);
      return
      const ok = this.willSave(cb);
      if (!ok) {
        cb(false);
        return;
      }
      this.doSave(cb);
    },
    cancel() {
      this.get('router').transitionTo('alert');
    },
  },
});
