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
      if (c === 'notscheduled') {
        return 'Not Scheduled';
      }
      if (c === 'notrunning') {
        return 'Not Running';
      }
      return 'NONE';
    }
    if (t === 'node' || t === 'nodeSelector') {
      const c = get(this, 'model.targetNode.condition');
      if (c === 'noready') {
        return 'Not Ready';
      }
      else {
        return `${c.toUpperCase()} usage over ${this.get('model.threshold')}%`
      }
      return 'NONE';
    }
    if (t == 'workload' || t === 'workloadSelector') {
      return `${get(this, 'model.targetWorkload.unavailablePercentage')}% unavailable`;
    }
    if (t === 'systemService') {
      return 'Unhealthy';
    }
  }.property('model.targetType'),

  displayTargetType: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      return `Pod`;
    }
    if (t === 'workload') {
      return 'Workload';
    }
    if (t === 'workloadSelector') {
      return 'Workload Selector';
    }
    if (t === 'systemService') {
      return 'System Service';
    }
    if (t === 'node') {
      return 'Node';
    }
    if (t === 'nodeSelector') {
      return 'Node Selector';
    }
  }.property('model.targetType'),

  displayTargetList: function() {
    const t = get(this, 'model.targetType');
    if (t == 'workloadSelector') {
      const ary = Object
        .entries(get(this, 'model.targetWorkload.selector'))
        .map(([k, v]) => `${k}:${v}`)
      return ary;
    }
    if (t == 'nodeSelector') {
      const ary = Object
            .entries(get(this, 'model.targetNode.selector'))
            .map(([k, v]) => `${k}:${v}`)
      return ary;
    }
    return [];
  }.property('model.targetType'),

});
