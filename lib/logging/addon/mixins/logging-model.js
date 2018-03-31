import { get, set } from '@ember/object'
import EmberObject from '@ember/object';
import Mixin from '@ember/object/mixin';

const DEFAULT_TARGET_TYPE = 'none';
export default Mixin.create({
  // needs to override the type props
  type: null,

  patch() {
    const t = get(this, 'targetType');
    const store = get(this, 'store');

    const nue = store.createRecord({
      type: this.get('type'),
    });

    const map = EmberObject.create({});

    nue.setProperties({
      outputTags: get(this, 'outputTags'),
      outputFlushInterval: get(this, 'outputFlushInterval'),
      config: get(this, `${t}Config`),
      requestsCPU: get(this, 'requestsCPU'),
      requestsMemory: get(this, 'requestsMemory'),
      limitsCPU: get(this, 'limitsCPU'),
      limitsMemory: get(this, 'limitsMemory'),
    });

    const loggingTagets = [
      'embedded',
      'kafka',
      'elasticsearch',
      'splunk',
      'syslog',
    ];

    loggingTagets.forEach(key => {
      const config = store.createRecord({
        type: `${key}Config`,
      });
      nue.set('config', config);
      map[key] = nue.clone();
    });

    this.setProperties(map);
    // if (t && t !== 'none') {
    //   set(this, `${t}.config`, get(this, `${t}Config`));
    //   set(this, `${t}.outputFlushInterval`, get(this, 'outputFlushInterval'));
    //   set(this, `${t}.outputTags`, get(this, 'outputTags'));
    //   set(this, `${t}.requestsCPU`, get(this, 'requestsCPU'));
    //   set(this, `${t}.requestsMemory`, get(this, 'requestsMemory'));
    //   set(this, `${t}.limitsCPU`, get(this, 'limitsCPU'));
    //   set(this, `${t}.limitsMemory`, get(this, 'limitsMemory'));
    // }
    return this;
  },

  targetType: function() {
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
    return DEFAULT_TARGET_TYPE;
  }.property('embeddedConfig', 'elasticsearchConfig', 'splunkConfig', 'kafkaConfig', 'syslogConfig'),
});
