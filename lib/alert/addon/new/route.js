import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  globalStore: service(),

  model(params, transition) {
    const store = get(this, 'store');
    const cs = get(this, 'globalStore');
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

    const notifiers = cs.findAll('notifier')
    return hash({
      pods,
      workloads,
      notifiers,
    })
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
