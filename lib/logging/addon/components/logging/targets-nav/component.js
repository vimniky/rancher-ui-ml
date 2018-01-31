import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  currentTarget: computed.reads('currentLogging.targetType'),

  hasCurrentTarget: function() {
    const cl = this.get('currentLogging');
    if (!cl) {
      return false
    }
    return cl.get('enable') && cl.get('targetType');
  }.property('currentLogging.{targetType,enable}'),

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
        label: 'Splunk',
        type: 'splunk',
        css: 'splunk' +  this.currentCss('splunk'),
        available: true,
        disabled: false,
      },
      {
        label: 'Kafka',
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