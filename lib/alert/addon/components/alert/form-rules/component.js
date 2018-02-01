import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  targetId: null,

  targetFilter: '',

  init(...args) {
    this._super(...args);
  },

  resetTarget: function() {
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
});
