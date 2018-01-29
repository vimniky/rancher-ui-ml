import Component from '@ember/component';
import {inject as service } from '@ember/service'

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
    sort: ['displayName'],
    width: '180'
  },
  {
    translationKey: 'generic.description',
    name: 'description',
    sort: ['description'],
    width: '180'
  },
  {
    translationKey: 'alertPage.index.table.rules',
    name: 'rules',
    sort: ['rules'],
  },
  {
    translationKey: 'alertPage.index.table.notifiers',
    name: 'recipientList',
    sort: ['recipientList'],
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
