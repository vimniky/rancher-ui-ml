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
      const tt = get(this, 'targetType');
      const model = get(this, 'model');
      const configtype = `${tt}Config`;
      model.set('projectId', get(this, 'project.id'));
      model.beforeSave(configtype);
      if (tt === 'kafka') {
        const kt = model.get('kafkaConfig.brokerType');
        if (kt === 'broker') {
          model.set('kafkaConfig.zookeeperEndpoint', null);
        } else if (kt === 'zookeeper') {
          model.set('kafkaConfig.brokerEndpoints', null);
        }
      }
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
