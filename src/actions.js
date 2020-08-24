import fetch from 'isomorphic-fetch';

import {
  getCSRFToken, checkStatus, parseJSON, shouldFetch,
} from './utils';

import * as t from './actionTypes';

// Fetching
export const fetchBusy = (nameSpace) => ({
  type: `${nameSpace}${t.FETCH_BUSY}`, // e.g. tags/FETCH_BUSY
});

export const fetchSuccess = (nameSpace, jsonResponse, append = false) => ({
  type: `${nameSpace}${t.FETCH_SUCCESS}`, // e.g. tags/FETCH_SUCCESS
  elems: jsonResponse,
  append,
});

export const fetchFailure = (nameSpace) => ({
  type: `${nameSpace}${t.FETCH_FAILURE}`, // e.g. tags/FETCH_FAILURE
});

/*
 * Fetch an array of elements.
 *
 * apiURL = e.g. http://www.example.com/api/v1/websites/
 * qeuryParams = e.g. ?page=12&slug=extra_content
 */
export const fetchElems = (nameSpace, apiURL, {
  queryParams = '', maxAgeInMinutes = 0, append = false, onErrorAction,
} = {}) => {
  let queryString = Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&');
  if (queryString) {
    queryString = `?${queryString}`;
  }

  const apiURLWithQueryParams = `${apiURL}${queryString}`;

  return (dispatch, getState) => {
    let doFetch = true;
    if (maxAgeInMinutes > 0) {
      doFetch = shouldFetch(getState()[nameSpace], maxAgeInMinutes);
    }

    if (doFetch) {
      dispatch(fetchBusy(nameSpace));
      return fetch(apiURLWithQueryParams, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(
          (response) => {
            dispatch(fetchSuccess(nameSpace, response, append));
          },
          (error) => {
            dispatch(fetchFailure(nameSpace));
            if (onErrorAction) {
              dispatch(onErrorAction(error));
            }

            // TODO: return the errors jsonResponse? or store in the elems state?
            // Also with createUpdateElem & deleteElem
            // return error.errorLogInfo.jsonResponse;
            // OR
            // dispatch(fetchFailure(nameSpace, error.errorLogInfo.jsonResponse));
          },
        );
    }
    return Promise.resolve();
  };
};

export const resetState = (nameSpace) => ({
  type: `${nameSpace}${t.RESET_STATE}`,
});

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

export const setUpdateBusyId = (nameSpace, id, busy) => ({
  type: `${nameSpace}${t.SET_UPDATE_BUSY_ID}`,
  id,
  busy,
});

export const createUpdateElem = (nameSpace, apiURL, data, id = -1) => {
  const apiURLWithId = id === -1
    ? apiURL
    : `${apiURL}${id}/`;
  const isUpdate = id > -1;

  // Do we have a file as payload? If so send multipart/form-data
  let isMultipart = false;
  Object.entries(data).forEach(([key, value]) => { // eslint-disable-line
    if (!isMultipart) {
      isMultipart = value ? typeof value.name === 'string' : false;
    }
  });

  let body;
  let headers = {
    'X-CSRFToken': getCSRFToken(),
  };
  if (!isMultipart) {
    body = JSON.stringify(data);
    headers = {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } else {
    body = new window.FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => body.append(key, val));
      } else {
        body.append(key, value);
      }
    });
  }

  return (dispatch) => {
    if (isUpdate) {
      dispatch(setUpdateBusyId(nameSpace, id, true));
    }
    return fetch(apiURLWithId, {
      method: isUpdate ? 'PATCH' : 'POST',
      credentials: 'include',
      headers,
      body,
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(
        (jsonResponse) => {
          dispatch(updateSuccess(nameSpace, id, jsonResponse));
          if (isUpdate) {
            dispatch(setUpdateBusyId(nameSpace, id, false));
          }
          return 'Success';
        },
        (error) => {
          if (isUpdate) {
            dispatch(setUpdateBusyId(nameSpace, id, false));
          }
          return error.errorLogInfo.jsonResponse;
        },
      );
  };
};

// Updating
export const setDeleteId = (nameSpace, id = -2) => ({
  type: `${nameSpace}${t.SET_DELETE_ID}`,
  id,
});

export const setDeleteBusyId = (nameSpace, id, busy) => ({
  type: `${nameSpace}${t.SET_DELETE_BUSY_ID}`,
  id,
  busy,
});

export const deleteElem = (nameSpace, apiURL, id) => {
  const apiURLWithId = `${apiURL}${id}/`;

  return (dispatch) => {
    dispatch(setDeleteBusyId(nameSpace, id, true));
    return fetch(apiURLWithId, {
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
          dispatch(setDeleteBusyId(nameSpace, id, false));
          return 'Success';
        },
        (error) => {
          dispatch(setDeleteBusyId(nameSpace, id, false));
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

// Expanding -2 (none expanded), -1 (all expanded), id (specific obj expanded)
export const setExpandId = (nameSpace, expandId = -1) => ({
  type: `${nameSpace}${t.SET_EXPAND_ID}`,
  expandId,
});
