import Ember from 'ember';
import { inject as service } from '@ember/service'

export default Ember.Component.extend({
  intl: service(),

  init() {
    this._super();
    const dateFormats = [
      {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'},
      {label: 'YYYY-MM', value: 'YYYY-MM'},
      {label: 'YYYY', value: 'YYYY'},
    ]
    this.set('dateFormats', dateFormats);
  },

  dateFormatString: function() {
    const fmt = this.get('model.esLogstashDateformat');
    return moment().format(fmt);
  }.property('model.esLogstashDateformat'),

  dateFrequenceLabel: function() {
    const fmt = this.get('model.esLogstashDateformat');
    switch (fmt) {
    case 'YYYY':
      return 'year';
    case 'YYYY-MM':
      return 'month';
    case 'YYYY-MM-DD':
      return 'day';
    default:
      return null;
    }
  }.property('model.esLogstashDateformat'),
});
