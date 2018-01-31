import Ember from 'ember';
import { inject as service } from '@ember/service'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

export default Ember.Component.extend(NewOrEdit, {
  scope: service(),
  pageScope: alias('scope.currentPageScope'),
  intl: service(),
  // input
  fileds: alias('model.outputTags'),
  errors: null,
  clone: null,
  targetType: null,

  init() {
    this._super(...arguments);
  },

  isClusterLevel: function() {
    return get(this, 'pageScope') === 'cluster';
  }.property('pageScope'),

  didReceiveAttrs() {
    this.set('originalModel', this.get('model').clone());
    this.set('clone', this.get('model').clone());
  },

  willSave() {
    let ok
    this.set('errors', null);
    ok = this.validate();
  },

  actions: {
    save(cb) {
      console.log('---------logging', get(this, 'model'));
      cb();
      return;
      Ember.RSVP.resolve(this.willSave()).then(ok => {
        if (!ok) {
          cb(false);
          return false;
        }
        this
          .doSave()
          .then(this.didSave.bind(this))
          .then(neu => this.doneSaving(neu, cb))
          .catch((err) => {
            cb();
            this.send('error', err);
            this.errorSaving(err);
          });
      });
    },

    switch(enable) {
      const om = this.get('originalModel');
      if (!enable) {
        om.set('enable', enable);
        om.save().then(neu => {
          this.set('currentLogging', neu);
        });
      }
    }
  },

  doneSaving(neu, cb) {
    // update the currentLogging afer logging has been saved
    this.set('currentLogging', neu);
    this._super(neu);
  },
});
