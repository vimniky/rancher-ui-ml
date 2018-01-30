import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'projectAlert',

  init(...args) {
    this._super(...args);
  },

  availableActions: function() {
    let a = this.get('actionLinks');
    let l = this.get('links');
    return [
      {
        label: 'action.edit',
        icon: 'icon icon-edit',
        action: 'edit',
        enabled: !!l.update,
      },
      {divider: true },
      {
        label: 'action.mute',
        action: 'mute',
        enabled: !!a.mute,
        bulkable: true,
      },
      {
        label: 'action.unmute',
        action: 'unmute',
        enabled: !!a.unmute,
        bulkable: true,
      },
      {
        label: 'action.remove',
        icon: 'icon icon-trash',
        action: 'promptDelete',
        enabled: !!l.remove,
        altAction: 'delete',
        bulkable: true,
      },
      {divider: true},
      {
        label: 'action.viewInApi',
        icon: 'icon icon-external-link',
        action: 'goToApi',
        enabled: true
      },
    ];
  }.property('actionLinks.{mute,unmute}','links.{update,remove}'),
});
