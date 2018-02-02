import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  originalTarget: computed.reads('originalLogging.targetType'),

  hasCurrentTarget: function() {
    const ol = this.get('originalLogging');
    if (!ol) {
      return false
    }
    return ol.get('enable') && ol.get('targetType');
  }.property('originalLogging.{targetType,enable}'),

  currentCss(type) {
    return this.get('hasCurrentTarget') && type === this.get('currentTarget') ? ' current' : '';
  },

  targets: function() {
    return [
      {
        type: 'none',
        label: 'Disable',
        css: 'none' +  this.currentCss('none'),
        classNames: '',
        available: true,
        disabled: false,
      },
      {
        type: 'embedded',
        label: 'Embedded',
        css: 'embedded' +  this.currentCss('embedded'),
        classNames: '',
        available: true,
        disabled: false,
      },
      {
        type: 'elasticsearch',
        label: 'Elasticsearch',
        css: 'elasticsearch' +  this.currentCss('elasticsearch'),
        available: true,
        disabled: false,
      },
      {
        label: '',
        type: 'splunk',
        css: 'splunk' +  this.currentCss('splunk'),
        available: true,
        disabled: false,
      },
      {
        label: '',
        type: 'kafka',
        css: 'kafka' +  this.currentCss('kafka'),
        available: true,
        disabled: false,
      },
      {
        label: 'Syslog',
        type: 'syslog',
        css: 'syslog' +  this.currentCss('syslog'),
        available: true,
        disabled: false,
      },
    ].filter(item => {
      return this.get('isClusterLevel') || item.type !== 'embedded';
    });
  }.property('isClusterLevel', 'currentTarget'),
});
