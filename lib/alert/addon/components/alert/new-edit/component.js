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
  showAdvanced: false,
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
      // customPagerdutyConfig: {
      // },
      // customWebhookConfig: {
      // },
      notifierId: null,
      recipient: null,
    };
    const projectOpt = {
      type: 'projectAlert',
      projectId: get(this, 'project.id'),
      displayName: '',
      targetType: 'pod',
      targetName: null,
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

    const clusterOpt = {
      type: 'clusterAlert',
      clusterId: get(this, 'cluster.id'),
      targetType: 'node',
      displayName: '',
      displayName: '',
      targetName: null,
      recipients: [
        defaultRecipient,
      ],
      targetNode: {
        id: null,
        condition: null,
        selector: null,
        cpuThreshold: 30,
        diskThreshold: 30,
        memThreshold: 30,
      },
      targetSystemService: {
        condition: null,
      },
    };

    let alert;
    if (ps === 'project') {
      alert = gs.createRecord(projectOpt);
    }
    if (ps === 'cluster') {
      // alert = gs.createRecord(clusterOpt);
      alert = gs.createRecord(projectOpt);
    }
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

  // mergeResult(newData) {
  //   const original = this.get('originalModel');
  //   if (original) {
  //     // Merge updated data to original model
  //     original.merge(newData);
  //     return original;
  //   }
  //   return newData;
  // },
  // validate(model) {
  //   const errors = model.validationErrors();
  //   if (errors.get('length')) {
  //     this.set('errors', errors);
  //     return false;
  //   }
  //   this.set('errors', null);
  //   return true;
  // },
  // willSave() {
  //   const alert = this.get('model');
  //   return this.validate(alert);
  // },
  // doSave(cb) {
  //   const alert = this.get('model');
  //   alert.save().then((alertData) => {
  //     this.mergeResult(alertData);
  //     this.doneSaving();
  //     cb();
  //   }).catch(err => {
  //     this.set('errors', [err]);
  //     cb();
  //   });
  // },
  // doneSaving: function() {
  //   return this.send('cancel');
  // },
  actions: {
    showAdvanced() {
      this.set('showAdvanced', true);
    },
    save(cb) {
      const newAlert = get(this, 'newAlert');
      console.log('----------alert', get(this, 'newAlert'));
      newAlert.save().then(res => {
        cb();
        this.send('cancel');
      }).catch(err => {
        cb(false);
      });
    },
    cancel() {
      this.get('router').transitionTo('alert');
    },
  },
});
