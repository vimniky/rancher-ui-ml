import Ember from 'ember';
import { inject as service } from '@ember/service'
import NewOrEdit from 'ui/mixins/new-or-edit';
import { get, set } from '@ember/object'
import { alias } from '@ember/object/computed'

const esLogPreview = `{
  "_index": "default-2018.01.15",
  "_type": "container_log",
  "_id": "AWD68LuuhwVvf5LMJq1h",
  "_version": 1,
  "_source": {
    "log": "time=\"2018-01-15T17:49:26Z\" level=info msg=\"Creating cluster event [Created container]\"\n",
    "stream": "stderr",
    "docker": {
      "container_id": "888f41afb92b1454fc5ba7baff87a50bad80b834e08d9f0bea042d77f4b2ec76"
    },
    "kubernetes": {
      "container_name": "cattle",
      "namespace_name": "default",
      "pod_name": "cattle-6b4ccb5b9d-tzs4q",
      "pod_id": "a958b2d8-f6b0-11e7-b992-00163e016dc2",
      "labels": {
        "app": "cattle",
        "pod-template-hash": "2607761658"
      },
      "host": "47.89.14.205",
      "master_url": "https://10.233.0.1:443/api"
    },
    "tag": "default.var.log.containers.cattle-6b4ccb5b9d-tzs4q_default_cattle-888f41afb92b1454fc5ba7baff87a50bad80b834e08d9f0bea042d77f4b2ec76.log",
    "@timestamp": "2018-01-15T17:49:26.000000000+00:00"
  }
}`;
const splunkLogPreview = `{
    "log": "time=\"2018-01-26T16:42:34Z\" level=info msg=\"Cluster [local] condition status unknown\"\n",
    "stream": "stderr",
    "docker": {
        "container_id": "a7dfa2da2550bb45f0c1fed5a315e13ea27ee0d50ce83359fdec49ed981db865"
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
    "tag": "default.var.log.containers.cattle-6b4ccb5b9d-v57vw_default_cattle-a7dfa2da2550bb45f0c1fed5a315e13ea27ee0d50ce83359fdec49ed981db865.log"
}`;

const kafkaLogPreviews = {
  json: `{
    "log": "your log is here \n",
    "stream": "stdout",
    "docker": {
        "container_id": "5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274"
    },
    "kubernetes": {
        "container_name": "splunk",
        "namespace_name": "cattle-system",
        "pod_name": "splunk-dep-848b7cbdd-5jqd4"
    },
    "time": 1515680329,
    "tag": "kubernetes.var.log.containers.splunk-dep-848b7cbdd-5jqd4_cattle-system_splunk-5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274.log"
}`,
  ltsv: `log:Waiting for web server at http://127.0.0.1:8000 to be available.... Done\n	stream:stdout	docker:{"container_id"=>"5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274"}	kubernetes:{"container_name"=>"splunk", "namespace_name"=>"cattle-system", "pod_name"=>"splunk-dep-848b7cbdd-5jqd4"}	time:1515680329	tag:kubernetes.var.log.containers.splunk-dep-848b7cbdd-5jqd4_cattle-system_splunk-5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274.log
log:If you get stuck, we're here to help.  \n	stream:stdout	docker:{"container_id"=>"5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274"}	kubernetes:{"container_name"=>"splunk", "namespace_name"=>"cattle-system", "pod_name"=>"splunk-dep-848b7cbdd-5jqd4"}	time:1515680329	tag:kubernetes.var.log.containers.splunk-dep-848b7cbdd-5jqd4_cattle-system_splunk-5f07a15a2a60ef48a8c4df3a9d82395f211e5aa0452eac11bf6303d328564274.log
log:The Splunk web interface is at htt`,

}

export default Ember.Component.extend(NewOrEdit, {
  scope: service(),
  pageScope: alias('scope.currentPageScope'),
  intl: service(),
  // input
  targetType: '',
  tags: null,
  errors: null,
  clone: null,
  targetChoices: null,
  flushInterval: 3,
  previewOpen: false,
  showAdvanced: false,

  init() {
    this._super(...arguments);
    if (!this.get('tags')) {
      this.set('tags', []);
    }
  },

  targetTypeChanged: function() {
    set(this, 'previewOpen', false);
    set(this, 'showAdvanced', false);
  }.observes('targetType'),

  logPreview: function() {
    const t = get(this, 'targetType');
    let log = '';
    switch (t) {
    case 'elasticsearch':
      log = esLogPreview;
      break;
    case 'splunk':
      log = splunkLogPreview;
      break;
    case 'kafka':
      log = kafkaLogPreviews.json;
      break;
    }
    return log;
  }.property('targetType'),

  isClusterLevel: function() {
    return get(this, 'pageScope') === 'cluster';
  }.property('pageScope'),

  didReceiveAttrs() {
    this.set('originalModel', this.get('model').clone());
    this.set('clone', this.get('model').clone());
  },

  showPreview: function() {
    return get(this, 'targetType') !== 'none' && get(this, 'targetType') !== 'embedded';
  }.property('targetType'),

  validateTags() {
    const errors = this.get('errors') || [];
    this.get('tags').forEach(t => {
      if (!t.key || !t.value) {
        errors.pushObject('Tag key or value can\'t be empty.')
      }
    });
    if (errors.length > 0) {
      return false;
    }
    return true;
  },

  dataTypeTransform() {
    this.set('model.esPort', Number(this.get('model.esPort')));
    this.set('model.splunkPort', Number(this.get('model.splunkPort')));
    this.set('model.outputFlushInterval', Number(this.get('model.outputFlushInterval')) || 1);
    this.set('model.targetType', this.get('targetType'));
    this.set('model.kafkaMaxSendRetries', Number(this.get('model.kafkaMaxSendRetries')));
    this.set('model.kafkaBrokers', (this.get('model.kafkaBrokers') || '').split(','))
    // this.set('model.kafkaMaxSendRetries', Number(this.get('model.kafkaMaxSendRetries')));
  },

  validate() {
    const errors = this.get('errors') || [];
    const model = this.get('model');
    switch(this.get('targetType')) {
    case 'elasticsearch':
      if (!model.get('esHost')) {
        errors.pushObject('Host can\'t be empty');
      }
      if (!String(model.get('esPort'))) {
        errors.pushObject('Port can\'t be empty');
      }
      break;
    case 'splunk':
      console.log(this.get('model'))
      console.log(this.get('targetType'))
      if (!model.get('splunkHost')) {
        errors.pushObject('Host can\'t be empty');
      }
      if (!String(model.get('splunkPort'))) {
        errors.pushObject('Port can\'t be empty');
      }
      if (! String(model.get('splunkToken'))) {
        errors.pushObject('Token can\'t be empty');
      }
      break;
    default:
    }
    if (errors.length > 0) {
      this.set('errors', errors);
      return false;
    }
    return true;
  },

  willSave() {
    let ok
    this.set('errors', null);
    this.dataTypeTransform();
    ok = this.validate();
    ok = this.validateTags();
    if (!ok) {
      return false;
    }
    const tagMap =  {};
    this.get('tags').forEach(tag => {
      tagMap[tag.key] = tag.value;
    });
    this.set('model.outputTags', tagMap);
    return true;
  },

  actions: {
    togglePreview: function() {
      this.toggleProperty('previewOpen');
    },
    toggleAdvanced() {
      this.toggleProperty('showAdvanced');
    },
    save(cb) {
      Ember.RSVP.resolve(this.willSave()).then(ok => {
        if (!ok) {
          cb(false);
          return false;
        }
        this
          .doSave()
          .then(this.didSave.bind(this))
          .then(neu => this.doneSaving(neu, cb))
          .catch((err) => {
            cb();
            this.send('error', err);
            this.errorSaving(err);
          });
      });
    },

    switch(enable) {
      const om = this.get('originalModel');
      if (!enable) {
        om.set('enable', enable);
        om.save().then(neu => {
          this.set('currentLogging', neu);
        });
      }
    }
  },

  doneSaving(neu, cb) {
    // update the currentLogging afer logging has been saved
    this.set('currentLogging', neu);
    const targetType = this.get('targetType');
    this._super(neu);
  },
});
