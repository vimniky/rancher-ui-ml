import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { hasMany } from 'ember-api-store/utils/denormalize';
import ResourceUsage from 'shared/mixins/resource-usage';
import Resource from 'ember-api-store/models/resource';

export default Resource.extend({
  type: 'notifier',

  notifierType: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'Slack';
    }
    if (pc) {
      return 'Pagerduty';
    }
    if (ec) {
      return 'Email';
    }
    if (wc) {
      return 'Webhook';
    }
    return '';

  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  notifierLabel: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'Slack Channel';
    }
    if (pc) {
      return 'Pagerduty Service Key';
    }
    if (ec) {
      return 'Email Address';
    }
    if (wc) {
      return 'Webhook URL';
    }
    return '';
  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),
  availableActions: function() {
    let a = this.get('actionLinks');
    let l = this.get('links');
    const choices = [
      {
        label: 'action.activate',
        icon: 'icon icon-play',
        action: 'activate',
        enabled: !!a.activate,
        bulkable: true,
      },
      {
        label: 'action.deactivate',
        icon: 'icon icon-pause',
        action: 'deactivate',
        enabled: !!a.deactivate,
        bulkable: true,
      },
      {divider: true },
      {
        label: 'action.edit',
        icon: 'icon icon-edit',
        action: 'edit',
        // enabled: !!l.update,
        enabled: true,
      },
      {
        label: 'action.clone',
        icon: 'icon icon-clone',
        action: 'clone',
        // enabled: !!l.update,
        enabled: true,
      },
      {divider: true},
      {
        label: 'action.remove',
        icon: 'icon icon-trash',
        action: 'promptDelete',
        enabled: !!l.remove,
        altAction: 'delete',
        bulkable: true,
      },
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
