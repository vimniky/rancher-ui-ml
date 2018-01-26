import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { hasMany } from 'ember-api-store/utils/denormalize';
import ResourceUsage from 'shared/mixins/resource-usage';
import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'notifier',

  availableActions: function() {
    // let a = this.get('actionLinks');
    let l = this.get('links');
    const choices = [
      {
        label: 'action.edit',
        icon: 'icon icon-edit',
        action: 'edit',
        enabled: true,
      },
      {divider: true },
      {
        label: 'action.remove',
        icon: 'icon icon-trash',
        action: 'promptDelete',
        enabled: !!l.remove, altAction: 'delete',
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
    return choices;
  }.property('actionLinks.{activate,deactivate}','links.{update,remove}'),
});
