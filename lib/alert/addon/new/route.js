import Route from '@ember/routing/route';

export default Route.extend({

  model(params, transition) {
    const store = this.get('store');
    const pods = [1,2,3].map(i => {
      return store.createRecord({
        type: 'pod',
        id: i,
        name: `pod-${i}`,
      });
    });

    const workloads = [1,2,3,4,5].map(i => {
      return store.createRecord({
        type: 'workload',
        id: i,
        name: `workload-${i}`,
      });
    });

    return {
      pods,
      workloads,
    }
  },

  // setupController(controller, model) {
  //   // if (model.alert) {
  //   //   controller.set('model', model.alert);
  //   // }
  // },

  resetController: function (controller, isExisting/*, transition*/) {
    if (isExisting) {
      controller.setProperties({
      })
    }
  }
});
