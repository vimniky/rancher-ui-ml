import Component from '@ember/component';
import {inject as service } from '@ember/service'
import { get, set } from '@ember/object';

const headers = [
  {
    translationKey: 'generic.state',
    name: 'state',
    sort: ['state'],
    width: '125'
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
  targetId: null,

  sortBy: 'name',
  alertState: 'all',
  headers,

  filteredAlerts: function() {
    let alerts = this.get('model') || [];
    const targetId = this.get('targetId');
    if (targetId) {
      alerts = alerts.filterBy('targetId', targetId);
    }
    return alerts.filter(alert => {
      const state = this.get('alertState');
      if (state === 'all') {
        return true;
      }
      return alert.get('state').toLocaleLowerCase() === state;
    });
  }.property('filtered.[],alertState,targetId'),
});
