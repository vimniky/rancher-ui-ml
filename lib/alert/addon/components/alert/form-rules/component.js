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

  selectedTarget: function() {
    if (get(this, 'newAlert.targetType') === 'workloadSelectors') {
      return null;
    }
    return get(this, 'targets')
      .filterBy('id', get(this, 'targetId'))
      .get('firstObject');
  }.property('targets', 'targetId', 'newAlert.targetType'),

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

    if (t === 'workload') {
      return get(this, 'workloads');
    };

    if (t === 'pod') {
      return get(this, 'pods');
    };

  }.property('newAlert.targetType','pods.[]','workloads.[]'),
  actions: {
  }
});
