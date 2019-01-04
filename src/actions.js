import fetch from 'isomorphic-fetch';

import { getCSRFToken, checkStatus, parseJSON } from './utils';

import * as t from './actionTypes';

// Fetching
export const fetchBusy = nameSpace => ({
  type: `${nameSpace}${t.FETCH_BUSY}`, // e.g. tags/FETCH_BUSY
});

export const fetchSuccess = (nameSpace, jsonResponse) => ({
  type: `${nameSpace}${t.FETCH_SUCCESS}`, // e.g. tags/FETCH_SUCCESS
  elems: jsonResponse,
});

export const fetchFailure = nameSpace => ({
  type: `${nameSpace}${t.FETCH_FAILURE}`, // e.g. tags/FETCH_FAILURE
});

/*
 * Fetch an array of elements.
 *
 * apiURL = e.g. http://www.example.com/api/v1/websites/
 * qeuryParams = e.g. ?page=12&slug=extra_content
 */
export const fetchElems = (nameSpace, apiPath, queryParams = '') => {
  const apiURL = `${process.env.API_URL}${apiPath}${queryParams}`;

  return (dispatch) => {
    dispatch(fetchBusy(nameSpace));
    return fetch(apiURL, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(
        (response) => {
          dispatch(fetchSuccess(nameSpace, response));
        },
        (/* error */) => {
          dispatch(fetchFailure(nameSpace));
        },
      );
  };
};


// Updating
export const setUpdateId = (nameSpace, id = -1) => ({
  type: `${nameSpace}${t.SET_UPDATE_ID}`, // e.g. tags/SET_UPDATE_ID
  id,
});

/*
 * An object was succesfully CREATED, UPDATED or DELETED
 */
export const updateSuccess = (nameSpace, id, jsonResponse) => ({
  type: `${nameSpace}${t.UPDATE_SUCCESS}`, // e.g. tags/UPDATE_SUCCESS
  id,
  elem: jsonResponse,
});

export const createUpdateElem = (nameSpace, apiPath, data, id = -1) => {
  const apiURL = id === -1
    ? `${process.env.API_URL}${apiPath}`
    : `${process.env.API_URL}${apiPath}${id}/`;
  const method = id === -1 ? 'POST' : 'PATCH';
  // const body = JSON.stringify(data);

  const body = new window.FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => body.append(key, val));
    } else {
      body.append(key, value);
    }
  });

  return (dispatch) => {
    return fetch(apiURL, {
      method,
      credentials: 'include',
      headers: {
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCSRFToken(),
      },
      body,
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(
        (jsonResponse) => {
          dispatch(updateSuccess(nameSpace, id, jsonResponse));
          return 'Success';
        },
        (error) => {
          return error.errorLogInfo.jsonResponse;
        },
      );
  };
};

export const deleteElem = (nameSpace, apiPath, id) => {
  const apiURL = `${process.env.API_URL}${apiPath}${id}/`;

  return (dispatch) => {
    return fetch(apiURL, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
    })
      .then(checkStatus) // .then(parseJSON) // Recieve a 204 No content, parseJSON not necessary
      .then(
        () => {
          dispatch(updateSuccess(nameSpace, id));
          return 'Success';
        },
        (error) => {
          return error.errorLogInfo.jsonResponse;
        },
      );
  };
};


// Filtering
export const setFilterValue = (nameSpace, value = '') => ({
  type: `${nameSpace}${t.SET_FILTER_VALUE}`,
  value,
});

// Sorting
export const setSortKey = (nameSpace, sortKey) => ({
  type: `${nameSpace}${t.SET_SORT_KEY}`,
  sortKey,
});
