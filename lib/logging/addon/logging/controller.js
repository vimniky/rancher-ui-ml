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
      syslogConfig: {
        severity: 'info',
      },
      elasticsearchConfig: {
        dateFormat: 'YYYY-MM-DD',
      },
      splunkConfig: {
      },
      embeddedConfig: {
      },
      kafkaConfig: {
        brokerType: 'zookeeper',
        zookeeperEndpoint: null,
        brokerEndpoints: [],
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
