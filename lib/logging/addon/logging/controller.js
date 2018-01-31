import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'

export default Controller.extend({
  globalStore: service(),

  queryParams: ['targetType'],
  targetType: 'none',
  logging: null,

  init() {
    const logging = get(this, 'globalStore').createRecord({
      type: 'logging',
      flushInterval: 3,
      outputTags: {},
      syslogConfig: {
        severity: 'info',
        program: null,
        endpoint: null,
      },
      elasticsearchConfig: {
        authUsername: '',
        authPassword: '',
        dateFormat: 'YYYY-MM-DD',
        indexPrefix: null,
        endpoint: '',
      },
      splunkConfig: {
        endpoint: '',
        source: '',
        token: '',
      },
      embeddedConfig: {
        dateFormat: 'YYYY-MM-DD',
        indexPrefix: null,
      },
      kafkaConfig: {
        topic: null,
        // comma separated enpoints string
        broker: null,
        zookeeper: null,
      },
    })
    set(this, 'logging', logging)
  },

  targetTypeChanged: function() {
    const l = this.get('logging');
    const t = this.get('targetType');
    if (l && l.get('targetType') !== t) {
      l.set('targetType', t);
    }
  }.observes('targetType', 'logging.targetType'),

});
