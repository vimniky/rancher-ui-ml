import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

const podConditions = [
  {label: 'Not Running', id: 'notrunning'},
  {label: 'Not Scheduled', id: 'notscheduled'},
  {label: 'Restarted', id: 'restarts'},
];

const workloadConditions = [
  {label: 'Unavailable', id: 'a'},
];

const targetTypes = [
  {label:'Workload', value: 'workload'},
  {label: 'Pod', value: 'pod'},
];
const targetPod = {
  condition: [
    "notrunning",
    "notscheduled",
    "restarts",
  ],
  restartTimes: 'int',
};

const targetWorkload = {
  selector: 'map[string]',
  unavailablePercentage: 'int, min:1,max:100',
};

export default Component.extend({
  targetTypes,
  targetId: null,

  podConditions,
  workloadConditions,
  initialArray: [{key: '', value: ''}],
  targetFilter: '',

  init(...args) {
    this._super(...args);
  },

  resetTarget: function() {
    set(this, 'targetId', null);
    set(this, 'targetFilter', '');
  }.observes('newAlert.targetType'),

  showWorkloadSelectors: function() {
    return get(this, 'targetId') === 'workloadSelectors'
  }.property('targetId'),

  selectedTarget: function() {
    return get(this, 'targets')
      .filterBy('id', get(this, 'targetId'))
      .get('firstObject');
  }.property('targets', 'targetId'),

  updateNewAlert: function() {
    const id = get(this, 'targetId');
    const t = get(this, 'newAlert.targetType');
    const name = get(this, 'selectedTarget.displayName');
    if (t === 'pod') {
      set(this, 'newAlert.targetPod.id', id);
    }
    if (t === 'workload') {
      set(this, 'newAlert.targetWorkload.id', id);
    }
    set(this, 'newAlert.targetName', name);
  }.observes('targetId', 'newAlert.targetType'),

  targets: function() {
    const t = get(this, 'newAlert.targetType');
    const wlSelector = {name: 'Use Workload Selectors', id: 'workloadSelectors'};

    if (!t) {
      return [];
    }

    if (t === 'workload') {
      return [
        wlSelector
      ].concat(get(this, 'workloads').get('content'));
    };

    if (t === 'pod') {
      return get(this, 'pods');
    };

  }.property('newAlert.targetType','pods.[]','workloads.[]'),
  actions: {
  }
});
