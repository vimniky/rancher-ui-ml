import { computed, get, set } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  init(...args) {
    this._super(...args);
  },

  actions: {
    // todo, don't know that this is needed
    noop() {
    },
  }
});
