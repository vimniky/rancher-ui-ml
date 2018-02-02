import { get, set} from '@ember/object';
import Component from '@ember/component';
import { alias } from '@ember/object/computed'
import { inject as service } from '@ember/service'

export default Component.extend({

  init(...args) {
    this._super(...args);
    let config = {
      endpoint: '',
      source: '',
      token: '',
    }
    const c = get(this, 'model.splunkConfig');
    console.log(c, this.get('model'));
    if (c) {
      config = c;
    }
    this.setProperties({
      'model.splunkConfig': config,
      config,
    });
  },

  logPreview: function() {
    const fieldsStr = get(this, 'fieldsStr');
    const template = `{
    "log": "time=\"${new Date().toString()}\" level=info msg=\"Cluster [local] condition status unknown\"\n",
    "stream": "stderr",
    "tag": "default.var.log.containers.cattle-6b4ccb5b9d-v57vw_default_cattle-xxx.log"
    "docker": {
        "container_id": "xxx"
    },
    "kubernetes": {
        "container_name": "cattle",
        "namespace_name": "default",
        "pod_name": "cattle-6b4ccb5b9d-v57vw",
        "pod_id": "30c685d0-fa43-11e7-b992-00163e016dc2",
        "labels": {
            "app": "cattle",
            "pod-template-hash": "2607761658"
        },
        "host": "47.52.113.251",
        "master_url": "https://10.233.0.1:443/api"
    },
${fieldsStr}
  ...
}`;
    return template
  }.property('fieldsStr'),

//   logPreview: function() {
//     const index = get(this, 'esIndex');
//     const fieldsStr = get(this, 'fieldsStr');
//     const template = `{
//   "_index": "${index}",
//   "_id": "AWD68LuuhwVvf5LMJq1h",
//   "_source": {
//     "log": "time=\"2018-01-15T17:49:26Z\" level=info msg=\"Creating cluster event [Created container]\"\n",
//     "kubernetes": {
//       "container_name": "cattle",
//       "namespace_name": "default",
//       "pod_name": "cattle-6b4ccb5b9d-tzs4q",
//       "labels": {
//         "app": "cattle",
//         "pod-template-hash": "2607761658"
//       },
//       "host": "47.89.14.205",
//       "master_url": "https://10.233.0.1:443/api"
//     },
// ${fieldsStr}
//   },
//   ...
// }`;
//     return template
//   }.property('esIndex', 'fieldsStr'),

  fieldsStr: function() {
    const keyValueMap = get(this, 'model.outputTags')
    if (!keyValueMap) {
      return '';
    }
    return Object.keys(keyValueMap).map(key => `    "${key}": "${keyValueMap[key]}"`).join(',\n');
  }.property('model.outputTags'),
});
