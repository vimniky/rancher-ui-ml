import Component from '@ember/component';
import {inject as service } from '@ember/service'
import { get, set } from '@ember/object';

const headers = [
  {
    translationKey: 'generic.state',
    name: 'state',
    sort: ['state'],
    width: '120'
  },
  {
    translationKey: 'generic.name',
    name: 'displayName',
    sort: ['displayName', 'description'],
    width: '200'
  },
  {
    translationKey: 'alertPage.index.table.target',
    name: 'target',
    sort: ['target'],
  },
  {
    translationKey: 'alertPage.index.table.condition',
    name: 'condition',
    sort: ['condition'],
  },
  {
    translationKey: 'alertPage.index.table.recipients',
    name: 'recipients',
    sort: ['recipients'],
  },
];

export default Component.extend({
  access: service(),

  // input
  model: null,
  sortBy: 'created',
  headers,

  filteredAlerts: function() {
    return get(this, 'model');
  }.property('model.[]'),
});
