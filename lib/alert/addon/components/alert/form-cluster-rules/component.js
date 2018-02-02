import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

const SYSTEM_SERVICES = [
  {label: 'DNS', value: 'dns'},
  {label: 'Etcd', value: 'etcd'},
  {label: 'Controller', value: 'controller'},
  {label: 'Manager', value: 'manager'},
  {label: 'Network', value: 'network'},
  {label: 'Scheduler', value: 'scheduler'},
];

export default Component.extend({

  init(...args) {
    this._super(...args);
    this.set('systemServices', SYSTEM_SERVICES);
  },

  percent: 80,
  setThreshold: function() {
    const condition = get(this, 'newAlert.targetNode.condition');
    const targetType = get(this, 'targetType');
    const percent = get(this, 'percent');
    const yes = ['node', 'nodeSelector'].indexOf(targetType) !== -1
          && ['cpu', 'mem', 'disk'].indexOf(condition) === -1;
    if (!yes) {
      return;
    }
    set(this, `newAlert.targetNode.${condition}Threshold`, percent);

  }.observes('percent', 'targetType'),

  actions: {
    // todo, don't know that this is needed
    noop() {
    },
  }
});
