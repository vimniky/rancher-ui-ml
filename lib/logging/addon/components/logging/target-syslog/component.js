import Ember from 'ember';

const severities = [
  'emerg',
  'alert',
  'crit',
  'err',
  'warning',
  'notice',
  'info',
  'debug'
].map(value => ({value, label: value.capitalize()}))

export default Ember.Component.extend({

  protocolChoices: null,
  timeFormatChoices: null,
  init(...args) {
    this._super(...args);
    this.set('severities', severities);
  },

});
