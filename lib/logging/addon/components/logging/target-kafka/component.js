import Component from '@ember/component'
import { alias } from '@ember/object/computed'
import { get, set } from '@ember/object'

export default Component.extend({
  config: alias('model.kafkaConfig'),
  brokerEndpoints: null,
  brokerType: 'zookeeper',

  init() {
    this._super();
    if (!get(this, 'brokerEndpoints')) {
      set(this, 'brokerEndpoints', [{endpoint: ''}]);
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
    const keyValueMap = get(this, 'fields')
    if (!keyValueMap) {
      return '';
    }
    return Object.keys(keyValueMap).map(key => `    "${key}": "${keyValueMap[key]}"`).join(',\n');
  }.property('fields'),

  esIndex: function() {
    return get(this, 'model.esLogstashPrefix') + '-' + get(this, 'dateFormatString');
  }.property('model.esLogstashPrefix', 'dateFormatString'),

  setCodeBlockHeight() {
    const h = this.$('.additional-logging-configuration-content').height() + 12;
    this.$('.logging-format pre').height(h + 'px');
  },

  fieldsChanged: function() {
    this.setCodeBlockHeight();
  }.observes('fields'),

  setBroker: function() {
    const eps = get(this, 'brokerEndpoints')
          .filter(item => !!item.endpoint)
          .map(item => item.endpoint);

    set(this, 'config.broker', eps.join(','));
  }.observes('brokerEndpoints.@each.endpoint'),

  actions: {
    add() {
      const ary = get(this, 'brokerEndpoints');
      get(this, 'brokerEndpoints').pushObject({endpoint: ''});
    },
    remove(item) {
      const ary = get(this, 'brokerEndpoints')
      ary.removeObject(item);
    }
  },
});
