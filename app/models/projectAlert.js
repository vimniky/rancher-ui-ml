import Resource from 'ember-api-store/models/resource';
import { get, set } from '@ember/object';

const ProjectAlert = Resource.extend({
  type: 'projectalert',

  init(...args) {
    this._super(...args);
  },
  cb() {
    this.delete().then(res => {
      get(this, 'store')._remove('projectalert', this);
    });
  },
  actions: {
    promptDelete: function() {
      this.get('modalService').toggleModal('confirm-delete', {resources: [this]});
    },
  },
  targetType: function() {
    const tp = get(this, 'targetPod');
    const tw = get(this, 'targetWorkload');
    if (tp && tp.id) {
      return 'pod';
    }
    if (tw && tw.id) {
      return 'workload'
    }
    if (tw && tw.selector) {
      return 'workloadSelector';
    }
  }.property('model.targetPod', 'model.targetWorkload'),

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

ProjectAlert.reopenClass({
  pollTransitioningDelay: 300,
  pollTransitioningInterval: 3000,
});

export default ProjectAlert;
