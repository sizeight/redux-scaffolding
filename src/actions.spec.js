import expect from 'expect';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  fetchBusy,
  fetchSuccess,
  fetchFailure,
  fetchElems,
  resetState,
  setUpdateId,
  updateSuccess,
  createUpdateElem,
  setUpdateBusyId,
  deleteElem,
  setDeleteBusyId,
  setFilterValue,
  setSortKey,
  setExpandId,
} from './actions';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


const nameSpace = 'websites'; // nameSpace used for testing
const apiHostname = 'https://www.example.com';
const apiPath = '/api/v1/websites/';
const apiURL = `${apiHostname}${apiPath}`;

describe('actions -> reduxBaseElem (async)', () => {
  afterEach(() => {
    nock.cleanAll();
  });


  it('fetchElems() -> No queryParams, Success', () => {
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPath)
      .reply(200, response);

    const expectedActions = [
      { type: 'websites/FETCH_BUSY' },
      { type: 'websites/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpace, apiURL))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> No queryParams, Failure', () => {
    nock(apiHostname)
      .get(apiPath)
      .reply(500, '');

    const expectedActions = [
      { type: 'websites/FETCH_BUSY' },
      { type: 'websites/FETCH_FAILURE' },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpace, apiURL))
      .then(() => {
        expect(store.getActions()).toMatchObject(expectedActions);
      });
  });


  it('fetchElems() -> With queryParams, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiPathAltWithQueryParams = `${apiPathAlt}?page=10&slug=extra_content`;
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAltWithQueryParams)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { queryParams }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With queryParams, Failure', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiPathAltWithQueryParams = `${apiPathAlt}?page=10&slug=extra_content`;
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    nock(apiHostname)
      .get(apiPathAltWithQueryParams)
      .reply(500, '');

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_FAILURE' },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { queryParams }))
      .then(() => {
        expect(store.getActions()).toMatchObject(expectedActions);
      });
  });


  it('fetchElems() -> With append = true, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const append = true;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: true },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { append }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With queryParams and append = true, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiPathAltWithQueryParams = `${apiPathAlt}?page=10&slug=extra_content`;
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    const append = true;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAltWithQueryParams)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: true },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { queryParams, append }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('fetchElems() -> With onErrorAction, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const onErrorAction = { type: 'SOME_ACTION' };
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      {
        type: 'posts/FETCH_SUCCESS',
        elems: response,
        append: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { onErrorAction }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With onErrorAction, Failure', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiURLAlt = `${apiHostname}/api/v1/posts/`;
    const onErrorAction = () => {
      return { type: 'SOME_ACTION' };
    };
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(500);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_FAILURE' },
      { type: 'SOME_ACTION' },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiPathAlt, { onErrorAction }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('fetchElems() -> With maxAgeInMinutes = 5 mins and refetch NOT required, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const maxAgeInMinutes = 5;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [];
    const store = mockStore({
      posts: {
        isFetching: false,
        lastUpdated: Date.now(),
        didInvalidate: false,
      },
    });
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { maxAgeInMinutes }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With maxAgeInMinutes = 5 mins and refetch IS required, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const maxAgeInMinutes = 5;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      {
        type: 'posts/FETCH_SUCCESS',
        elems: response,
        append: false,
      },
    ];
    const store = mockStore({
      posts: {
        isFetching: false,
        lastUpdated: Date.now() - 300001,
        didInvalidate: false,
      },
    });
    return store.dispatch(fetchElems(nameSpaceAlt, apiURLAlt, { maxAgeInMinutes }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('fetchElems() -> camelCase nameSpace should be changes to lowercase in API call', () => {
    const camelCaseNameSpace = 'subscriptionTerms';
    const apiPathAlt = '/api/v1/subscriptionterms/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(apiHostname)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'subscriptionTerms/FETCH_BUSY' },
      { type: 'subscriptionTerms/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(camelCaseNameSpace, apiURLAlt))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> CREATE Success', () => {
    const data = { title: 'New website' };
    nock(apiHostname)
      .post(apiPath, data)
      // .post(apiPath, body => body === '[object FormData]')
      .reply(201, { id: 16 });

    const expectedActions = [
      {
        type: 'websites/UPDATE_SUCCESS',
        id: -1,
        elem: { id: 16 },
      },
    ];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiURL, data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('createUpdateElem() -> CREATE Failure', () => {
    const data = { title: 'New website' };
    nock(apiHostname)
      .post(apiPath, data)
      // .post(apiPath, body => body === '[object FormData]')
      .reply(500, {});

    const expectedActions = [];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiURL, data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> UPDATE Success', () => {
    const id = 15;
    const data = { title: 'Changed title' };
    nock(apiHostname)
      .patch(`${apiPath}${id}/`, data)
      // .patch(`${apiPath}${id}/`, body => body === '[object FormData]')
      .reply(200, { id: 15 });

    const expectedActions = [
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'websites/UPDATE_SUCCESS',
        id: 15,
        elem: { id: 15 },
      },
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiURL, data, id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('createUpdateElem() -> UPDATE Failure', () => {
    const id = 15;
    const data = { title: 'Changed title' };
    nock(apiHostname)
      .patch(`${apiPath}${id}/`, data)
      // .patch(`${apiPath}${id}/`, body => body === '[object FormData]')
      .reply(500, {});

    const expectedActions = [
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiURL, data, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> File in data should be sent as multipart/form-data', () => {
    const id = 15;
    const data = { title: 'New term', file: { name: 'newfile.jpg' } };
    nock(apiHostname)
      .patch(`${apiPath}${id}/`, body => body === '[object FormData]')
      .reply(201, { id: 15 });

    const expectedActions = [
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'websites/UPDATE_SUCCESS',
        id: 15,
        elem: { id: 15 },
      },
      {
        type: 'websites/SET_UPDATE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiURL, data, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('deleteElem() -> DELETE Success', () => {
    const id = 15;
    nock(apiHostname)
      .delete(`${apiPath}${id}/`)
      .reply(204);

    const expectedActions = [
      {
        type: 'websites/SET_DELETE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'websites/UPDATE_SUCCESS',
        id: 15,
        elem: undefined,
      },
      {
        type: 'websites/SET_DELETE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(deleteElem(nameSpace, apiURL, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('deleteElem() -> DELETE Failures', () => {
    const id = 15;
    nock(apiHostname)
      .delete(`${apiPath}${id}/`)
      .reply(500, {});

    const expectedActions = [
      {
        type: 'websites/SET_DELETE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'websites/SET_DELETE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(deleteElem(nameSpace, apiURL, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('deleteElem() -> camelCase nameSPace should be changes to lowercase in API call', () => {
    const camelCaseNameSpace = 'subscriptionTerms';
    const apiPathAlt = '/api/v1/subscriptionterms/';
    const apiURLAlt = `${apiHostname}${apiPathAlt}`;
    const id = 15;
    nock(apiHostname)
      .delete(`${apiPathAlt}${id}/`)
      .reply(204);

    const expectedActions = [
      {
        type: 'subscriptionTerms/SET_DELETE_BUSY_ID',
        id: 15,
        busy: true,
      },
      {
        type: 'subscriptionTerms/UPDATE_SUCCESS',
        id: 15,
        elem: undefined,
      },
      {
        type: 'subscriptionTerms/SET_DELETE_BUSY_ID',
        id: 15,
        busy: false,
      },
    ];
    const store = mockStore({});
    return store.dispatch(deleteElem(camelCaseNameSpace, apiURLAlt, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});


describe('actions -> reduxBaseElem', () => {
  it('fetchBusy', () => {
    const expectedAction = {
      type: 'websites/FETCH_BUSY',
    };
    expect(fetchBusy(nameSpace)).toEqual(expectedAction);
  });

  it('fetchSuccess', () => {
    const response = [{ id: 1 }, { id: 2 }];
    const expectedAction = {
      type: 'websites/FETCH_SUCCESS',
      elems: response,
      append: false,
    };
    expect(fetchSuccess(nameSpace, response)).toEqual(expectedAction);
  });

  it('fetchFailure', () => {
    const expectedAction = {
      type: 'websites/FETCH_FAILURE',
    };
    expect(fetchFailure(nameSpace)).toEqual(expectedAction);
  });


  it('resetState', () => {
    const expectedAction = {
      type: 'websites/RESET_STATE',
    };
    expect(resetState(nameSpace)).toEqual(expectedAction);
  });


  it('setUpdateId() -> 15', () => {
    const id = 15;
    const expectedAction = {
      type: 'websites/SET_UPDATE_ID',
      id,
    };
    expect(setUpdateId(nameSpace, id)).toEqual(expectedAction);
  });

  it('setUpdateId() -> not specified', () => {
    const expectedAction = {
      type: 'websites/SET_UPDATE_ID',
      id: -1,
    };
    expect(setUpdateId(nameSpace)).toEqual(expectedAction);
  });

  it('setUpdateBusyId() -> true', () => {
    const id = 15;
    const busy = true;
    const expectedAction = {
      type: 'websites/SET_UPDATE_BUSY_ID',
      id,
      busy,
    };
    expect(setUpdateBusyId(nameSpace, id, busy)).toEqual(expectedAction);
  });

  it('setUpdateBusyId() -> false', () => {
    const id = 15;
    const busy = false;
    const expectedAction = {
      type: 'websites/SET_UPDATE_BUSY_ID',
      id,
      busy,
    };
    expect(setUpdateBusyId(nameSpace, id, busy)).toEqual(expectedAction);
  });

  it('updateSuccess() -> CREATE', () => {
    const id = -1;
    const elem = { id: 16 };
    const expectedAction = {
      type: 'websites/UPDATE_SUCCESS',
      id,
      elem,
    };
    expect(updateSuccess(nameSpace, id, elem)).toEqual(expectedAction);
  });

  it('updateSuccess() -> UPDATE', () => {
    const id = 15;
    const elem = { id: 15 };
    const expectedAction = {
      type: 'websites/UPDATE_SUCCESS',
      id,
      elem,
    };
    expect(updateSuccess(nameSpace, id, elem)).toEqual(expectedAction);
  });

  it('updateSuccess() -> DELETE', () => {
    const id = 15;
    const expectedAction = {
      type: 'websites/UPDATE_SUCCESS',
      id,
      elem: undefined,
    };
    expect(updateSuccess(nameSpace, id)).toEqual(expectedAction);
  });


  it('setDeleteBusyId() -> true', () => {
    const id = 15;
    const busy = true;
    const expectedAction = {
      type: 'websites/SET_DELETE_BUSY_ID',
      id,
      busy,
    };
    expect(setDeleteBusyId(nameSpace, id, busy)).toEqual(expectedAction);
  });

  it('setDeleteBusyId() -> false', () => {
    const id = 15;
    const busy = false;
    const expectedAction = {
      type: 'websites/SET_DELETE_BUSY_ID',
      id,
      busy,
    };
    expect(setDeleteBusyId(nameSpace, id, busy)).toEqual(expectedAction);
  });


  it('setFilterValue() -> Lorem ipsum', () => {
    const value = 'Lorem ipsum';
    const expectedAction = {
      type: 'websites/SET_FILTER_VALUE',
      value,
    };
    expect(setFilterValue(nameSpace, value)).toEqual(expectedAction);
  });

  it('setFilterValue() -> Clear with no value specified', () => {
    const expectedAction = {
      type: 'websites/SET_FILTER_VALUE',
      value: '',
    };
    expect(setFilterValue(nameSpace)).toEqual(expectedAction);
  });

  it('setSortKey() -> title', () => {
    const sortKey = 'title';
    const expectedAction = {
      type: 'websites/SET_SORT_KEY',
      sortKey,
    };
    expect(setSortKey(nameSpace, sortKey)).toEqual(expectedAction);
  });

  it('setExpandId() -> 1', () => {
    const expandId = 1;
    const expectedAction = {
      type: 'websites/SET_EXPAND_ID',
      expandId,
    };
    expect(setExpandId(nameSpace, expandId)).toEqual(expectedAction);
  });
});
