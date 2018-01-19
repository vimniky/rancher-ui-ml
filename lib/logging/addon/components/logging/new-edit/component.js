import Ember from 'ember';
import { inject as service } from '@ember/service'
import NewOrEdit from 'ui/mixins/new-or-edit';

export default Ember.Component.extend(NewOrEdit, {
  intl: service(),

  // input
  targetType: '',
  tags: null,

  errors: null,
  clone: null,
  targetChoices: null,

  init() {
    this._super(...arguments);
    if (!this.get('tags')) {
      this.set('tags', []);
    }
  },

  didReceiveAttrs() {
    this.set('originalModel', this.get('model').clone());
    this.set('clone', this.get('model').clone());
  },

  validateTags() {
    const errors = this.get('errors') || [];
    this.get('tags').forEach(t => {
      if (!t.key || !t.value) {
        errors.pushObject('Tag key or value can\'t be empty.')
      }
    });
    if (errors.length > 0) {
      return false;
    }
    return true;
  },

  dataTypeTransform() {
    this.set('model.esPort', Number(this.get('model.esPort')));
    this.set('model.splunkPort', Number(this.get('model.splunkPort')));
    this.set('model.outputFlushInterval', Number(this.get('model.outputFlushInterval')) || 1);
    this.set('model.targetType', this.get('targetType'));
    this.set('model.kafkaMaxSendRetries', Number(this.get('model.kafkaMaxSendRetries')));
    this.set('model.kafkaBrokers', (this.get('model.kafkaBrokers') || '').split(','))
    // this.set('model.kafkaMaxSendRetries', Number(this.get('model.kafkaMaxSendRetries')));
  },

  validate() {
    const errors = this.get('errors') || [];
    const model = this.get('model');
    switch(this.get('targetType')) {
    case 'elasticsearch':
      if (!model.get('esHost')) {
        errors.pushObject('Host can\'t be empty');
      }
      if (!String(model.get('esPort'))) {
        errors.pushObject('Port can\'t be empty');
      }
      break;
    case 'splunk':
      console.log(this.get('model'))
      console.log(this.get('targetType'))
      if (!model.get('splunkHost')) {
        errors.pushObject('Host can\'t be empty');
      }
      if (!String(model.get('splunkPort'))) {
        errors.pushObject('Port can\'t be empty');
      }
      if (! String(model.get('splunkToken'))) {
        errors.pushObject('Token can\'t be empty');
      }
      break;
    default:
    }
    if (errors.length > 0) {
      this.set('errors', errors);
      return false;
    }
    return true;
  },

  willSave() {
    let ok
    this.set('errors', null);
    this.dataTypeTransform();
    ok = this.validate();
    ok = this.validateTags();
    if (!ok) {
      return false;
    }
    const tagMap =  {};
    this.get('tags').forEach(tag => {
      tagMap[tag.key] = tag.value;
    });
    this.set('model.outputTags', tagMap);
    return true;
  },

  actions: {
    save(cb) {
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
    const targetType = this.get('targetType');
    this._super(neu);
  },
});
