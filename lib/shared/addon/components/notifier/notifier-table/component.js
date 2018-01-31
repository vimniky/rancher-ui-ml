import Component from '@ember/component';
import {inject as service } from '@ember/service'
import layout from './template';

const headers = [
  {
    translationKey: 'generic.state',
    name: 'state',
    sort: ['state'],
    width: '150'
  },
  {
    translationKey: 'generic.type',
    name: 'notifierType',
    sort: ['notifierType'],
  },
  {
    translationKey: 'generic.name',
    name: 'displayName',
    sort: ['displayName'],
  },
  {
    translationKey: 'notifierPage.index.table.createdAt',
    name: 'createdAt',
    sort: ['createdAt'],
  },
];

export default Component.extend({
  layout,
  // input
  model: null,
  sortBy: 'name',
  headers,

  filteredNotifiers: function() {
    const notifiers = this.get('model') || [];
    return notifiers;
  }.property('model.[]'),
});
