import { mAction } from '../../../mobx/action'
import {IRootAction, IRootStore} from "../../../typings";

@mAction
export default class ${uppercaseName}$Action {
  constructor(public stores: IRootStore["${rootPageName}$"], public actions: IRootStore["${rootPageName}$"]) {

  }
}
