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
  {label:'Workload', value: 'workload'},
  {label: 'Pod', value: 'pod'},
];

export default Component.extend({
  percent: 30,
  targetTypes,
  targetType: 'workload',
  // targetId: 'workloadSelectors',

  podRules,
  podRule: null,
  workloadRules,
  workloadRule: null,
  selectors: null,
  initialArray: [{key: '', value: ''}],

  restartedTimes: 1,
  init(...args) {
    this._super(...args);
    this.set('selectors', []);
  },

  showWorkloadSelectors: function() {
    return get(this, 'targetId') === 'workloadSelectors'
  }.property('targetId'),

  setOverviewRules: function() {
    const targetType = get(this, 'targetType');
    const targetName = get(this, 'selectedTarget.displayName');

    const out = {
      pod: {
        targetName,
        rule: get(this, 'podRule'),
      },
      workload: {
        targetName,
        rule: get(this, 'workloadRule'),
      }
    }
    set(this, 'overviewRules', out);
  }.observes('targetType', 'selectedTarget', 'podRule', 'workloadRule'),

  selectedTarget: function() {
    return get(this, 'targets')
      .filterBy('id', get(this, 'targetId'))
      .get('firstObject');
  }.property('targets'),

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
