import Resource from 'ember-api-store/models/resource';
import { get, set } from '@ember/object';

const ClusterAlert = Resource.extend({
  type: 'clusteralert',

  init(...args) {
    this._super(...args);
  },

  targetType: function() {
    const targetSystemService = get(this, 'targetSystemService');
    const targetNode = get(this, 'targetNode');
    if (targetSystemService && targetSystemService.condition) {
      return 'systemService';
    }
    if (targetNode && targetNode.id) {
      return 'node'
    }
    if (targetNode && targetNode.selector) {
      return 'nodeSelector';
    }
  }.property('model.targetSystemService', 'model.targetNode'),

  threshold: function() {
    const t = get(this, 'targetType');
    if (t === 'none' || t === 'nodeSelector') {
      const c = get(this, 'model.targetNode.condition');
      if (c === 'cpu') {
        return get(this, 'model.targetNode.cpuThreshold');
      }
      if (c === 'mem') {
        return get(this, 'model.targetNode.memThreshold');
      }
      if (c === 'disk') {
        return get(this, 'model.targetNode.diskThreshold');
      }
    }
    return '';
  }.property('targetType'),

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
        label: 'alertPage.action.mute',
        action: 'mute',
        enabled: !!a.mute,
        icon: 'icon icon-mute',
        bulkable: true,
      },
      {
        label: 'alertPage.action.unmute',
        action: 'unmute',
        icon: 'icon icon-unmute',
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

ClusterAlert.reopenClass({
  pollTransitioningDelay: 300,
  pollTransitioningInterval: 3000,
});

export default ClusterAlert;
