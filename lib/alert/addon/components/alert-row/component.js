import { get, set } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),
  model: null,
  tagName: 'TR',
  classNames: 'main-row',
  bulkActions: true,

  condition: function() {
    const t = get(this, 'model.targetType');
    if (t === 'pod') {
      return get(this, 'model.targetPod.condition');
    }
    if (t == 'workload' || t === 'workloadSelector') {
      return `${get(this, 'model.targetWorkload.unavailablePercentage')}% unavailable`;
    }
  }.property('model.targetType'),

  targetType: function() {
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
  recipients: function() {
    return (get(this, 'model.recipients') || [])
      .filter(item => item && item.recipientType && item.recipient)
      .map(item => `${item.recipientType.capitalize()}/${item.recipient}}`)
      .join(', ');
  }.property('model.recipients.{recipientType}'),
  targetAry: function() {
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
