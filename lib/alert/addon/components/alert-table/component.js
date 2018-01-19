import Component from '@ember/component';
import {inject as service } from '@ember/service'
import FilterState from 'ui/mixins/filter-state';

const headers = [
  {
    translationKey: 'generic.state',
    name: 'state',
    sort: ['state'],
    width: '125'
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
    sort: ['rules', 'id', 'targetType', 'recipientType'],
  },
  {
    translationKey: 'alertPage.index.table.endpoint',
    name: 'endpoint',
    sort: ['endpoint'],
    width: '200'
  },
];

export default Component.extend(FilterState, {
  access: service(),

  // input
  model: null,
  targetId: null,

  sortBy: 'name',
  queryParams: ['alertState'],
  alertState: 'all',
  headers,

  filteredAlerts: function() {
    let alerts = this.get('filtered');
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
