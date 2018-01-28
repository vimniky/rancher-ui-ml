import Ember from 'ember';

export default Ember.Component.extend({
  targetType: null,

  init() {
    this._super();
  },


  showSearch: function() {
    const ts = this.get('targets');
    return ts && ts.get('length') > 10;
  }.property('targets.length'),

  targets: function() {
    return [
      {label: 'Pod', id: 'Test0'},
      {label: 'Workload', id: 'Test1'},
    ];
  }.property('targetType'),
});
