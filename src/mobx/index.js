export { mStore } from './store';
export { mAction } from './action';
export { instanceType } from './meta';
export { provider } from './provider'; //放最后，顺序不能乱，否则有循环依赖问题
