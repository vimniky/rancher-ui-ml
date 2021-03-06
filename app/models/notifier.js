import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import ResourceUsage from 'shared/mixins/resource-usage';
import Resource from 'ember-api-store/models/resource';

const Notifier = Resource.extend({
  type: 'notifier',

  notifierType: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'slack';
    }
    if (pc) {
      return 'pagerduty';
    }
    if (ec) {
      return 'email';
    }
    if (wc) {
      return 'webhook';
    }
    return '';

  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  notifierValue: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');
    if (sc) {
      return get(sc, 'defaultRecipient');
    }
    if (pc) {
      // return get(pc, 'serviceKey');
      return '***';
    }
    if (ec) {
      return get(ec, 'defaultRecipient');
    }
    if (wc) {
      return get(wc, 'url');
    }
    return '';

  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  notifierLabel: function() {
    const sc = this.get('slackConfig');
    const pc = this.get('pagerdutyConfig');
    const ec = this.get('smtpConfig');
    const wc = this.get('webhookConfig');

    if (sc) {
      return 'Channel';
    }
    if (pc) {
      return 'Service Key';
    }
    if (ec) {
      return 'Address';
    }
    if (wc) {
      return 'URL';
    }
    return 'Notifier';
  }.property('slackConfig', 'pagerdutyConfig', 'emailConfig', 'webhookConfig'),

  availableActions: function() {
    let a = this.get('actionLinks');
    let l = this.get('links');
    return [
      // {
      //   label: 'action.activate',
      //   icon: 'icon icon-play',
      //   action: 'activate',
      //   enabled: !!a.activate,
      //   bulkable: true,
      // },
      // {
      //   label: 'action.deactivate',
      //   icon: 'icon icon-pause',
      //   action: 'deactivate',
      //   enabled: !!a.deactivate,
      //   bulkable: true,
      // },
      {divider: true },
      {
        label: 'action.edit',
        icon: 'icon icon-edit',
        action: 'edit',
        enabled: !!l.update,
        enabled: true,
      },
      {
        label: 'action.clone',
        icon: 'icon icon-clone',
        action: 'clone',
        icon: 'icon icon-copy',
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
  }.property('actionLinks.{activate,deactivate}','links.{update,remove}'),
});

Notifier.reopenClass({
  pollTransitioningDelay: 300,
  pollTransitioningInterval: 3000,
});

export default Notifier;
