import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

const podConditions = [
  {label: 'Is Not Running', id: 'notrunning'},
  {label: 'Is Not Scheduled', id: 'notscheduled'},
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
  targetType: 'pod',
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
  }.observes('targetType'),

  showWorkloadSelectors: function() {
    return get(this, 'targetId') === 'workloadSelectors'
  }.property('targetId'),

  selectedTarget: function() {
    return get(this, 'targets')
      .filterBy('id', get(this, 'targetId'))
      .get('firstObject');
  }.property('targets', 'targetId'),

  setTargetId: function() {
    const id = get(this, 'targetId');
    const t = get(this, 'targetType');
    if (t === 'pod') {
      set(this, 'newAlert.targetPod.id', id);
    }
    if (t === 'workload') {
      set(this, 'newAlert.targetWorkload.id', id);
    }
  }.property('targetId', 'targetType'),

  targets: function() {
    const t = get(this, 'targetType').toLowerCase();
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

  }.property('targetType','pods.[]','workloads.[]'),
  actions: {
    addSelector() {
    },
  }
});
