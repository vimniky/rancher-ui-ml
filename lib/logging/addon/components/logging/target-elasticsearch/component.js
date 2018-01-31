import Ember from 'ember';
import { inject as service } from '@ember/service'
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

const dateFormats = [
  {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'},
  {label: 'YYYY-MM', value: 'YYYY-MM'},
  {label: 'YYYY', value: 'YYYY'},
];

export default Ember.Component.extend({
  scope: service(),
  project: alias('scope.currentProject'),
  cluster: alias('scope.currentCluster'),
  pageScope: alias('scope.currentPageScope'),
  dateFormatChoices: null,
  model: null,
  fields: null,

  init(...args) {
    this._super(...args)
    set(this, 'model.esLogstashPrefix', get(this, 'defaultPrefix'));
    this.set('dateFormats', dateFormats);
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

  dateFormatString: function() {
    const fmt = this.get('model.esLogstashDateformat');
    return moment().format(fmt);
  }.property('model.esLogstashDateformat'),

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

  defaultPrefix: function() {
    const pageScope = get(this, 'pageScope')
    if (pageScope === 'cluster') {
      return get(this, 'cluster.name');
    } else if (pageScope === 'project') {
      return get(this, 'cluster.name') + '_' + get(this, 'project.name')
    }
    return '';
  }.property('project.name,cluster.name'),
});
