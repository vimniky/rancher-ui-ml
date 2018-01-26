import Ember from 'ember';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

export default Ember.Component.extend({
  scope: service(),
  project: alias('scope.currentProject'),
  cluster: alias('scope.currentCluster'),
  dateFormatChoices: null,
  model: null,
  tags: null,

  init(...args) {
    this._super(...args)
    set(this, 'model.esLogstashPrefix', get(this, 'defaultPrefix'));
  },
  defaultPrefix: function() {
    return get(this, 'cluster.name')+ '_' + get(this, 'project.name')
  }.property('project.name,cluster.name'),
  dateFormatString: function() {
    const fmt = this.get('model.esLogstashDateformat');
    return moment().format(fmt);
  }.property('model.esLogstashDateformat'),

  dateFormatTypeLabel: function() {
    const fmt = this.get('model.esLogstashDateformat');
    switch (fmt) {
    case 'YYYY':
      return 'yearly';
    case 'YYYY.MM':
      return 'monthly';
    case 'YYYY.MM.DD':
      return 'daily';
    default:
      return null;
    }
  }.property('model.esLogstashDateformat'),

  dateFrequenceLabel: function() {
    const fmt = this.get('model.esLogstashDateformat');
    switch (fmt) {
    case 'YYYY':
      return 'year';
    case 'YYYY.MM':
      return 'month';
    case 'YYYY.MM.DD':
      return 'day';
    default:
      return null;
    }
  }.property('model.esLogstashDateformat'),
});
