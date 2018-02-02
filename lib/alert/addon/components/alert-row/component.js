import { get, set } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),
  model: null,
  tagName: 'TR',
  classNames: 'main-row',
  bulkActions: true,

  displayCondition: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      const c = get(this, 'model.targetPod.condition');
      if (c === 'restarts') {
        const times = get(this, 'model.targetPod.restartTimes');
        return `Restarted times ${times} within the last 5 minutes`;
      }
      return c;
    }
    if (t == 'workload' || t === 'workloadSelector') {
      return `${get(this, 'model.targetWorkload.unavailablePercentage')}% unavailable`;
    }
  }.property('model.targetType'),

  displayTargetType: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      return `Pod`;
    }
    if (t == 'workload') {
      return 'Workload';
    }
    if (t == 'workloadSelector') {
      return 'Workload Selector';
    }
  }.property('model.targetType'),

  displayTargetList: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      return `Pod`;
    }
    if (t == 'workload') {
      return 'workload';
    }
    if (t == 'workloadSelector') {
      const ary = Object
        .entries(get(this, 'model.targetWorkload.selector'))
        .map(([k, v]) => `${k}:${v}`)
      return ary;
    }
  }.property('model.targetType'),

});
