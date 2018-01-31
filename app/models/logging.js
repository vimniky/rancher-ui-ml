import Resource from 'ember-api-store/models/resource';
import { get, set } from '@ember/object'

export default Resource.extend({
  type: 'logging',
  defaultTargetType: 'none',

  targetType: function() {
    if (!get(this, 'id')) {
      return get(this, 'defaultTargetType');
    }
    const ed = get(this, 'embeddedConfig');
    const es = get(this, 'elasticsearchConfig');
    const splunk = get(this, 'splunkConfig');
    const kafka = get(this, 'kafkaConfig');
    const syslog = get(this, 'syslogConfig');

    // do data transform here !

  }.property('embeddedConfig', 'elasticsearchConfig', 'splunkConfig', 'kafkaConfig', 'syslogConfig'),
});
