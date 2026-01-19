/**
 * @description Dedicated entry point for OpenStates API models.
 * This allows importing via '@legislative-tracker/models/openstates'
 * if configured in tsconfig, or via namespaced exports.
 */

export type * from './lib/open-states/api-response.model';
export type * from './lib/open-states/bill.model';
export type * from './lib/open-states/committee.model';
export type * from './lib/open-states/common.model';
export type * from './lib/open-states/event.model';
export type * from './lib/open-states/jurisdiction.model';
export type * from './lib/open-states/legislative-session.model';
export type * from './lib/open-states/organization.model';
export type * from './lib/open-states/person.model';
export type * from './lib/open-states/vote-event.model';
