import fetch from 'isomorphic-fetch';

export default (url, body) => (
  fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
);
