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
    translationKey: 'generic.name',
    name: 'name',
    sort: ['name'],
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
  type: 'all',
  headers,

  filteredNotifiers: function() {
    const notifiers = this.get('model') || [];
    return notifiers.filter(notifier => {
      const type = this.get('type');
      if (type === 'all') {
        return true;
      }
      return notifier.get('type').toLocaleLowerCase() === type;
    });
  }.property('model.[],type'),
});
