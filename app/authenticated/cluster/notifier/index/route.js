import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object'

export default Route.extend({

  model() {

    const cs = get(this, 'globalStore');

    return hash({
      notifiers: cs.findAll('notifier'),
    });
  },
});
