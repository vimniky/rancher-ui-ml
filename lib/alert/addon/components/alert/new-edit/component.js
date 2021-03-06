import EmberObject from '@ember/object';
import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { get, set } from '@ember/object'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { inject as service } from '@ember/service'

export default Component.extend(NewOrEdit, {
  router: service(),
  intl: service(),
  globalStore: service(),
  pageScope: reads('scope.currentPageScope'),
  project: reads('scope.currentProject'),
  cluster: reads('scope.currentCluster'),
  namespace: reads('projects.namespace'),
  scope: service(),

  originalModel: null,
  showAdvanced: false,
  errors: null,
  pods: null,
  workloads: null,
  severity: 'info',
  newAlert: null,

  init() {
    this._super(...arguments);
    set(this, 'model', EmberObject.create({
      advancedOptions: {},
    }));
    this.createNewAlert();
  },

  createNewAlert() {
    const ps = get(this, 'pageScope');
    const gs = get(this, 'globalStore');
    const defaultRecipient = {
      notifierId: null,
      recipient: null,
      notifierType: null,
    };
    const projectOpt = {
      type: 'projectAlert',
      projectId: get(this, 'project.id'),
      displayName: null,
      targetType: 'pod',
      targetName: null,
      recipients: [
        defaultRecipient,
      ],
      targetPod: {
        condition: 'notrunning',
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
      // targetType: 'systemService',
      targetType: 'systemService',
      displayName: '',
      targetName: null,
      recipients: [
        defaultRecipient,
      ],
      targetNode: {
        id: null,
        condition: 'notready',
        selector: null,
        cpuThreshold: 80,
        diskThreshold: 80,
        memThreshold: 80,
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
      alert = gs.createRecord(clusterOpt);
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
  getToSaveAlert() {
    const clone = get(this, 'newAlert').clone();
    const targetType = get(this, 'newAlert.targetType');
    if (targetType === 'pod') {
      clone.setProperties({
        targetWorkload: null,
      });
    }
    if (targetType === 'workload') {
      clone.setProperties({
        targetPod: null,
        'targetWorkload.selector': null,
      });
    }
    if (targetType === 'workloadSelector') {
      clone.setProperties({
        targetPod: null,
        'targetWorkload.id': null,
      });
    }
    return clone;
  },
  actions: {
    showAdvanced() {
      this.set('showAdvanced', true);
    },
    save(cb) {
      const newAlert = this.getToSaveAlert();
      console.log('----------alert clone', newAlert);
      newAlert.save().then(res => {
        cb();
        this.send('cancel');
      }).catch(err => {
        cb(false);
      });
    },
    cancel() {
      const ps = get(this, 'pageScope');
      if (ps === 'project') {
        this.get('router').transitionTo('alert');
      }
      // todo
      if (ps === 'cluster') {
        this.get('router').transitionTo(`authenticated.cluster.alert`);
      }
    },
  },
});
