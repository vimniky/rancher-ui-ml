import Ember from 'ember';
import { inject as service } from '@ember/service'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

export default Ember.Component.extend(NewOrEdit, {
  scope: service(),
  globalStore: service(),
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

  delete(model, cb) {
    const pageScope = this.get('pageScope');
    const loggingType = pageScope === 'cluster' ? 'clusterlogging' : 'projectlogging';
    const nue = get(this, 'globalStore').createRecord({
      type: loggingType,
      outputFlushInterval: 3,
      outputTags: {},
    });
    model.delete().then(res => {
      this.set('model', nue)
      this.set('originalModel', nue.clone);
      cb(true);
    });
  },
  actions: {
    save(cb) {
      const tt = get(this, 'targetType');
      const model = get(this, 'model');
      if (tt === 'none') {
        this.delete(model, cb);
        return;
      }
      const pageScope = this.get('pageScope');
      if (pageScope === 'project') {
        model.set('projectId', get(this, 'project.id'));
      }
      if (pageScope === 'cluster') {
        model.set('clusterId', get(this, 'cluster.id'));
      }
      const configtype = `${tt}Config`;
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
        set(this, 'model', nue);
        set(this, 'originalModel', nue.clone());
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
