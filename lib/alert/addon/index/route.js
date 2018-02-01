import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from "@ember/service";
import { reads } from '@ember/object/computed'
import { get, set } from '@ember/object';

export default Route.extend({
  scope: service(),
  project: reads('scope.currentProject'),
  cluster: reads('scope.currentCluster'),
  pageScope: reads('scope.currentPageScope'),
  globalStore: service(),

  model() {
    const pageScope = get(this, 'pageScope');
    let gs = get(this, 'globalStore');
    let alerts = null;
    if (pageScope === 'cluster') {
      const clusterId = get(this, 'cluster.id')
      // todo
      alerts = gs.find('clusterAlert', null, {filter: {}});
    }
    if (pageScope === 'project') {
      const projectId = get(this, 'project.id')
      // todo
      alerts = gs.find('projectAlert', null, {filter: {}});
    }
    return hash({
      alerts,
    });
  },
});
