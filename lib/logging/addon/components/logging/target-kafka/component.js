import Component from '@ember/component'
import { alias } from '@ember/object/computed'
import { get, set } from '@ember/object'

export default Component.extend({

  brokerType: 'zookeeper',
  brokerEndpoints: null,
  cachedBrokerEndpoints: null,
  cachedZookeeper: null,

  init() {
    this._super();
    let config = {
      topic: null,
      // comma separated enpoints string
      brokerEndpoints: null,
      zookeeperEndpoint: null,
    }
    const c = get(this, 'model.kafkaConfig');
    console.log(c, this.get('model'));
    if (c) {
      config = c;
    }
    this.setProperties({
      'model.kafkaConfig': config,
      config,
    });

    const endpoints = get(this, 'model.kafkaConfig.brokerEndpoints');
    if (endpoints) {
      set(this, 'brokerEndpoints', endpoints.split(',').map(endpoint => ({endpoint})));
    }
    const brokerEndpoints = get(this, 'model.kafkaConfig.brokerEndpoints');
    const zookeeperEndpoint = get(this, 'model.kafkaConfig.zookeeperEndpoint')
    if (brokerEndpoints) {
      set(this, 'brokerType', 'broker')
    }
    if (zookeeperEndpoint) {
      set(this, 'brokerType', 'zookeeper');
    }
  },

  logPreview: function() {
    const index = get(this, 'esIndex');
    const fieldsStr = get(this, 'fieldsStr');
    const template = `{
  "_index": "${index}",
  "_id": "AWD68LuuhwVvf5LMJq1h",
  "_source": {
    "log": "time=\"2018-01-15T17:49:26Z\" level=info msg=\"Creating cluster event [Created container]\"\n",
    "kubernetes": {
      "container_name": "cattle",
      "namespace_name": "default",
      "pod_name": "cattle-6b4ccb5b9d-tzs4q",
      "labels": {
        "app": "cattle",
        "pod-template-hash": "2607761658"
      },
      "host": "47.89.14.205",
      "master_url": "https://10.233.0.1:443/api"
    },
${fieldsStr}
  },
  ...
}`;
    return template
  }.property('esIndex', 'fieldsStr'),

  fieldsStr: function() {
    const keyValueMap = get(this, 'model.outputTags')
    if (!keyValueMap) {
      return '';
    }
    return Object.keys(keyValueMap).map(key => `    "${key}": "${keyValueMap[key]}"`).join(',\n');
  }.property('model.outputTags'),

  esIndex: function() {
    return get(this, 'model.esLogstashPrefix') + '-' + get(this, 'dateFormatString');
  }.property('model.esLogstashPrefix', 'dateFormatString'),

  // cache and restore
  brokerTypeChange: function() {
    const t = get(this, 'brokerType');
    const brokerEndpoints = get(this, 'brokerEndpoints');
    const zookeeper = get(this, 'config.zookeeper');
    const cachedZookeeper = get(this, 'cachedZookeeper');
    const cachedBrokerEndpoint = get(this, 'cachedBrokerEndpoints');
    set(this, 'model.kafkaConfig.brokerType', t);
    if (t === 'zookeeper') {
      set(this, 'cachedBrokerEndpoints', brokerEndpoints);
      set(this, 'config.zookeeper', cachedZookeeper);
      set(this, 'brokerEndpoints', null);
    } else if (t === 'broker') {
      if (!cachedBrokerEndpoint) {
        this.send('add');
      } else {
        set(this, 'brokerEndpoints', cachedBrokerEndpoint);
      }
      set(this, 'cachedZookeeper', zookeeper);
      set(this, 'config.zookeeper', null);
    }
  }.observes('brokerType'),

  setBroker: function() {
    const eps = get(this, 'brokerEndpoints')
    let nue;

    if (!eps) {
      nue = null;
    } else {
      nue = eps.filter(item => !!item.endpoint).map(item => item.endpoint).join(',');
    }

    set(this, 'config.brokerEndpoints', nue);
  }.observes('brokerEndpoints.@each.endpoint'),

  canRemove: function() {
    return get(this, 'brokerEndpoints.length') > 1;
  }.property('brokerEndpoints.length'),

  actions: {
    add() {
      const ary = get(this, 'brokerEndpoints');
      if (!ary) {
        set(this, 'brokerEndpoints', [{endpoint: ''}]);
      } else {
        ary.pushObject({endpoint: ''});
      }
    },
    remove(item) {
      if (get(this, 'canRemove')) {
        get(this, 'brokerEndpoints').removeObject(item);
      }
    }
  },
});
