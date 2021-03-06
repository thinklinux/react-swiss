import determineCondition from '../utils/determineCondition';
import isSelector from '../utils/isSelector';
import { isDefaultMixin } from '../features/mixins';

const convertStylesToArray = (
  obj,
  previousSelectors,
  recursiveOptions = {}
) => {
  if (typeof obj !== 'object') return obj;
  const newObj = Object.entries(obj);
  return newObj
    .map(([key, value]) => {
      let selectors = [...previousSelectors];
      // All @-stuff from css, should go global.
      if (key.startsWith('@')) {
        selectors = [key];
      }

      let type = 'node';
      let condition = null;
      if (key.startsWith('_')) {
        if (isDefaultMixin(key)) return null;
        type = 'mixin';
      } else if (Array.isArray(value)) {
        type = 'array';
        value = value.map((v, i) => {
          if (typeof v === 'object') {
            return convertStylesToArray(v, selectors);
          }
          return {
            type: 'node',
            selectors,
            append: true,
            key,
            value: v,
            condition
          };
        });
      } else if (typeof value === 'object' && value) {
        type = 'nested';
        // If media query, take current selector, and put it after the media query
        if (key.startsWith('@media')) {
          selectors.push(previousSelectors[previousSelectors.length - 1]);
        } else if (selectors[0].startsWith('@keyframes')) {
          if (!key.startsWith('@keyframes')) {
            selectors.push(key);
          }
        }
        // CSS Selectors like "&:hover" etc.
        else if (isSelector(key)) {
          const currentSel = selectors[selectors.length - 1];
          if (currentSel !== '&' && isSelector(currentSel)) {
            // Support multi level , seperated deeper nesting.
            key = key
              .split(/,\ ?/g)
              .map(keyS => {
                return currentSel
                  .split(/,\ ?/g)
                  .map(currentS => {
                    return keyS.replace(/&/gi, currentS);
                  })
                  .join(', ');
              })
              .join(', ');
          }
          selectors[selectors.length - 1] = key;
        }
        // Else we assume this is prop based conditions
        else {
          // setting condition to determine if styles should be applied
          if (!recursiveOptions.disableProps) {
            condition = determineCondition(key);
          }
        }
        value = convertStylesToArray(value, selectors, recursiveOptions);
      }

      return {
        type,
        key,
        value,
        selectors,
        condition
      };
    })
    .filter(v => !!v);
};
export default convertStylesToArray;
