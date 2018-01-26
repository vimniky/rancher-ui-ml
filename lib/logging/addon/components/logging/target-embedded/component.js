import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['target-embedded'],
  init(...args) {
    this._super(...args);
  },
  currentType: null,
  actions: {
    activate(idx) {
    }
  },
  defaultActiveIdx: null,
  didReceiveAttrs() {
  },
});
