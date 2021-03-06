import { parseConstants } from './constants';

const mixins = {};
const defaultMixins = {};
export function addDefaultMixin(name, mixin) {
  if (!name.startsWith('_')) {
    name = `_${name}`;
  }
  defaultMixins[name] = mixin;
}

export function addMixin(name, mixin) {
  if (typeof name !== 'string') {
    return console.warn(
      'swiss addMixin: first argument should be name of mixin'
    );
  }
  if (['function', 'object'].indexOf(typeof mixin) === -1) {
    return console.warn(
      'swiss addMixin: second argument should be a function or an object'
    );
  }
  if (!name.startsWith('_')) {
    name = `_${name}`;
  }
  if (defaultMixins[name]) {
    return console.warn(
      `swiss addMixin: ${name.slice(1)} is a reserved mixin name.`
    );
  }
  mixins[name] = mixin;
}

export function getMixin(name) {
  const foundMixin = mixins[name];
  if (!foundMixin) {
    console.warn(`swiss: unknown mixin: ${name}`);
  }
  return foundMixin;
}
export function isDefaultMixin(name) {
  return !!defaultMixins[name];
}
export function runDefaultMixin(name, value, setOption) {
  const mixin = defaultMixins[name];
  if (mixin) {
    if (setOption) {
      mixin(setOption, value);
    } else {
      console.warn(
        `swiss warning: mixin "${name.slice(
          1
        )}" can only be called in root, it cannot be returned in mixins, global styles or functional values.`
      );
    }
    return true;
  }
  return false;
}
export function runMixin(name, value) {
  if (runDefaultMixin(name, value)) {
    return null;
  }
  const mixin = getMixin(name);
  let result = mixin || null;
  if (typeof mixin === 'function') {
    if (!Array.isArray(value)) {
      value = [value];
    }
    // Make sure keys for mixins get parsed.
    value = value.map(v => parseConstants(v));

    result = mixin(...value);
    if (typeof result !== 'object') {
      console.warn(
        `swiss: mixin "${name.slice(
          1
        )}" returned ${typeof result}. Expected object`
      );
      result = {};
    }
  }
  return result;
}
