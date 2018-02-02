import Resource from 'ember-api-store/models/resource';
import { get, set } from '@ember/object';

const ProjectAlert = Resource.extend({
  type: 'projectalert',

  init(...args) {
    this._super(...args);
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

  actions:{
    mute() {
      this.doAction('mute').catch(err => {
      });
    },
    unmute() {
      this.doAction('mute').catch(err => {
      });
    },
    activate() {
      this.doAction('activate').catch(err => {
      });
    },
    deactivate() {
      this.doAction('deactivate').catch(err => {
      });
    },
  },

  relevantState: function() {
    return this.get('combinedState') || this.get('status.state') || 'unknown';
  }.property('combinedState','state'),

  availableActions: function() {
    let a = this.get('actionLinks');
    let l = this.get('links');
    const state = this.get('status.state');
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
        enabled: state === 'alerting',
        icon: 'icon icon-mute',
        bulkable: true,
      },
      {
        label: 'alertPage.action.unmute',
        action: 'unmute',
        icon: 'icon icon-unmute',
        enabled: state === 'muted',
        bulkable: true,
      },
      {
        label: 'action.deactivate',
        action: 'deactivate',
        icon: 'icon icon-deactivate',
        enabled: state === 'active',
        bulkable: true,
      },
      {
        label: 'action.activate',
        icon: 'icon icon-active',
        action: 'activate',
        enabled: state === 'inactive',
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
