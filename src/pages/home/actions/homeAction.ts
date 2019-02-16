import { mAction } from '../../../mobx/action';

@mAction
export default class HomeAction {
  constructor(public stores, public actions) {}
}
