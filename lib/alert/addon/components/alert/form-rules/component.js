import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

const podRules = [
  {label: 'Is Not Running', id: 'a'},
  {label: 'Is Not Scheduled', id: 'b'},
  {label: 'Restarted', id: 'c'},
];

const workloadRules = [
  {label: 'Unavailable', id: 'a'},
];

const targetTypes = [
  {label: 'Pod', value: 'pod'},
  {label:'Workload', value: 'workload'},
];

export default Component.extend({
  percent: 30,
  targetTypes,
  targetType: 'workload',

  podRules,
  podRule: null,
  workloadRules,
  workloadRule: null,
  selectors: null,
  targetId: null,

  restartedTimes: 1,
  init(...args) {
    this._super(...args);
    this.set('selectors', []);
  },

  showWorkloadSelectors: function() {
    return get(this, 'targetId') === 'workloadSelectors'
  }.property('targetId'),

  targets: function() {
    const t = get(this, 'targetType');
    const wlSelector = {name: 'Use Workload Selectors', id: 'workloadSelectors'};

    if (!t) {
      return [];
    }

    if (t === 'workload') {
      return [
        wlSelector
      ].concat(get(this, t + 's'));
    };

    if (t === 'pod') {
      return get(this, t + 's');
    };

  }.property('targetType','pods.[]','workloads.[]'),
  actions: {
    addSelector() {
    },
  }
});
