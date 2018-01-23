import Ember from 'ember';
import { inject as service } from '@ember/service';
import layout from './template'

export default Ember.Component.extend({
  layout,

  intl: service(),
  model: null,
  tagName: 'TR',
  classNames: 'main-row',
  bulkActions: true,
});
