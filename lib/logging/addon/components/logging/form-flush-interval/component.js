import Ember from 'ember';
import {
  STATUS,
  STATUS_INTL_KEY,
  classForStatus
} from 'shared/components/accordion-list-item/component';
import { inject as service } from '@ember/service'

export default Ember.Component.extend({
  intl: service(),

  status: function() {
    let k = STATUS.STANDARD;
    const flusshInterval = this.get('flushInterval');
    const originalFlushInterval = this.get('originalFlushInterval');
    if (!flusshInterval) {
      k = STATUS.INCOMPLETE;
    }
    if (+flusshInterval !== +originalFlushInterval) {
      k = STATUS.CONFIGURED;
    }
    this.set('statusClass', classForStatus(k));
    return this.get('intl').t(`${STATUS_INTL_KEY}.${k}`);
  }.property('flushInterval', 'originalFlushInterval'),
});
