import Ember from 'ember';
import { inject as service } from '@ember/service'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

export default Ember.Component.extend(NewOrEdit, {
  scope: service(),
  pageScope: alias('scope.currentPageScope'),
  cluster: alias('scope.currentCluster'),
  project: alias('scope.currentProject'),

  intl: service(),
  // input
  fileds: alias('model.outputTags'),
  errors: null,
  targetType: null,

  init() {
    this._super(...arguments);
  },

  isClusterLevel: function() {
    return get(this, 'pageScope') === 'cluster';
  }.property('pageScope'),

  willSave() {
    let ok
    this.set('errors', null);
    ok = this.validate();
  },

  actions: {
    save(cb) {
      const model = get(this, 'model');
      const configtype = `${get(this, 'targetType')}Config`;
      model.set('clusterId', get(this, 'cluster.id'));
      model.beforeSave(configtype);
      console.log('---------------model', model);
      model.save().then(nue => {
        console.log(nue);
        cb(true);
      }).catch(err => {
        console.log(err);
      });
    },
  },
  doneSaving(neu, cb) {
    // update the originalLogging afer logging has been saved
    // this.set('originalLogging', neu);
    // this._super(neu);
  },
});
