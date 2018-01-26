import Ember from 'ember';

const brokerTypes = [
  {
    label: 'Zookeeper', value: 'zookeeper',
  },
  {
    label: 'Broker', value: 'broker',
  },
];

const outputDataTypes = [
  {
    label: 'JSON', value: 'json',
  },
  {
    label: 'LTSV', value: 'ltsv',
  },
  {
    label: 'MsgPack', value: 'MsgPack',
  },
];

export default Ember.Component.extend({
  brokerTypes: null,

  hostPortStr: '',
  kafkaMaxSendRetries: 5,

  init() {
    this._super();
    // const types = this.get('loggingStore')
    //       .getById('schema', 'logging')
    //       .optionsFor('kafkaBrokerType')
    //       .map(v => ({
    //         value: v,
    //         label: v,
    //       }));
    // const outputDataTypes = this.get('loggingStore')
    //       .getById('schema', 'logging')
    //       .optionsFor('kafkaOutputDataType')
    //       .map(v => ({
    //         value: v,
    //         label: v,
    //       }));
    // this.set('brokerTypes', types);
    // this.set('outputDataTypes', outputDataTypes);
    this.set('brokerTypes', brokerTypes);
    this.set('outputDataTypes', outputDataTypes);
  },

  // hostPortStrChanged: function() {
  //   const str = this.get('hostPortStr');
  //   const t = this.get('kafkaBrokerType');
  //   if (t === 'broker') {
  //     this.set('model.kafkaBrokers', str);
  //   } else if (t === 'zookeeper') {
  //     this.set('kafkaZookeeper', str);
  //   }
  // }.observes('hostPortStrChanged'),

  addButtonLabel: function() {
    // todo
    return 'Add Broker'
    const t =  this.get('model.kafkaBrokerType');
    if (t === 'broker') {
      return 'Add Broker';
    }
    if (t === 'zookeeper') {
      return 'Add Zookeepr';
    }
  }.property('model.kafkaBrokerType'),
});
