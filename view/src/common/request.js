import 'isomorphic-fetch';

export default (url, body, method) => (
  fetch(url, {
    method: method || (body ? 'POST' : 'GET'),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: sessionStorage.getItem('jwt:token'),
    },
    body: JSON.stringify(body),
  })
);
