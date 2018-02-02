import Resource from 'ember-api-store/models/resource';
import { get, set } from '@ember/object'
import { inject as service } from '@ember/service'
import { alias } from '@ember/object/computed'

export default Resource.extend({
  type: 'projectlogging',
  defaultTargetType: 'none',

  beforeSave(configType) {
    const config = get(this, configType);
    this.setProperties({
      embeddedConfig: null,
      elasticsearchConfig: null,
      splunkConfig: null,
      kafkaConfig: null,
      syslogConfig: null,
    });

    set(this, configType, config);
  },

  targetType: function() {
    if (!get(this, 'id')) {
      return get(this, 'defaultTargetType');
    }
    const ed = get(this, 'embeddedConfig');
    const es = get(this, 'elasticsearchConfig');
    const splunk = get(this, 'splunkConfig');
    const kafka = get(this, 'kafkaConfig');
    const syslog = get(this, 'syslogConfig');

    if (ed) {
      return 'embedded';
    }
    if (es) {
      return 'elasticsearch';
    }
    if (splunk) {
      return 'splunk';
    }
    if (syslog) {
      return 'syslog';
    }
    if (kafka) {
      return 'kafka';
    }
    return get(this, 'defaultTargetType');
  }.property('embeddedConfig', 'elasticsearchConfig', 'splunkConfig', 'kafkaConfig', 'syslogConfig'),
});
