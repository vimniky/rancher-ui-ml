import Component from '@ember/component';
import es from 'logging/mixins/target-elasticsearch';
import { get, set } from '@ember/object';

export default Component.extend(es, {

  init(...args) {
    this._super(...args);
    const model = get(this, 'model');
    const limitsCPU = model.get('limitsCPU');
    set(this, 'limitsCPU', limitsCPU / 1000);
  },

  limitsCPUChanged: function() {
    const model = get(this, 'model');
    const limitsCPU = get(model,'limitsCPU');
    set(model, 'limitsCPU', limitsCPU * 1000);
  }.observes('limitsCPU'),

});
