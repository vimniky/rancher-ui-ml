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

  actions: {
    // todo, don't know that this is needed
    noop() {
    },
  }
});
