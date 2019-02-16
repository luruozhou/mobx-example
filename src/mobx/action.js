import { actionNameSymbol, appActionKeySymbol, actionTypeSymbol } from './meta';
import { App } from './app';

export let mAction = (config = {}) => target => {
  target[actionNameSymbol] = config.name || target.name || null;
  target[actionTypeSymbol] = config.type;
  App[appActionKeySymbol] = App[appActionKeySymbol] || [];
  App[appActionKeySymbol].push({
    target,
    name: config.name,
    page: config.page,
  });
  return target;
};
