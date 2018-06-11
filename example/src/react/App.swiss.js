import { styleSheet } from 'swiss-react';

export default styleSheet('App', {
  Wrapper: {
    _flex: 'center',
    _size: '100%',
  },
  Label: {
    _el: 'span',
    _size: ['100px', '100px'],
    background: 'blue',
    color: '#{color}',
  },
});