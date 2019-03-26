import expect from 'expect';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  fetchBusy, fetchSuccess, fetchFailure, fetchElems,
  setUpdateId, updateSuccess, createUpdateElem, setUpdateBusyId,
  deleteElem, setDeleteBusyId,
  setFilterValue, setSortKey,
} from './actions';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


const nameSpace = 'websites'; // nameSpace used for testing
const apiPath = '/api/v1/websites/';

describe('actions -> reduxBaseElem (async)', () => {
  afterEach(() => {
    nock.cleanAll();
  });


  it('fetchElems() -> No queryParams, Success', () => {
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(process.env.API_URL)
      .get(apiPath)
      .reply(200, response);

    const expectedActions = [
      { type: 'websites/FETCH_BUSY' },
      { type: 'websites/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpace, apiPath))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> No queryParams, Failure', () => {
    nock(process.env.API_URL)
      .get(apiPath)
      .reply(500, '');

    const expectedActions = [
      { type: 'websites/FETCH_BUSY' },
      { type: 'websites/FETCH_FAILURE' },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpace, apiPath))
      .then(() => {
        expect(store.getActions()).toMatchObject(expectedActions);
      });
  });


  it('fetchElems() -> With queryParams, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(process.env.API_URL)
      .get(`${apiPathAlt}?page=10&slug=extra_content`)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiPathAlt, { queryParams }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With queryParams, Failure', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    nock(process.env.API_URL)
      .get(`${apiPathAlt}?page=10&slug=extra_content`)
      .reply(500, '');

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_FAILURE' },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiPathAlt, { queryParams }))
      .then(() => {
        expect(store.getActions()).toMatchObject(expectedActions);
      });
  });


  it('fetchElems() -> With append = true, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const append = true;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(process.env.API_URL)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: true },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiPathAlt, { append }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetchElems() -> With queryParams and append = true, Success', () => {
    const nameSpaceAlt = 'posts';
    const apiPathAlt = '/api/v1/posts/';
    const queryParams = {
      page: 10,
      slug: 'extra_content',
    };
    const append = true;
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(process.env.API_URL)
      .get(`${apiPathAlt}?page=10&slug=extra_content`)
      .reply(200, response);

    const expectedActions = [
      { type: 'posts/FETCH_BUSY' },
      { type: 'posts/FETCH_SUCCESS', elems: response, append: true },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(nameSpaceAlt, apiPathAlt, { queryParams, append }))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('fetchElems() -> camelCase nameSpace should be changes to lowercase in API call', () => {
    const camelCaseNameSpace = 'subscriptionTerms';
    const apiPathAlt = '/api/v1/subscriptionterms/';
    const response = [
      { id: 15 },
      { id: 18 },
    ];
    nock(process.env.API_URL)
      .get(apiPathAlt)
      .reply(200, response);

    const expectedActions = [
      { type: 'subscriptionTerms/FETCH_BUSY' },
      { type: 'subscriptionTerms/FETCH_SUCCESS', elems: response, append: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchElems(camelCaseNameSpace, apiPathAlt))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> CREATE Success', () => {
    const data = { title: 'New website' };
    nock(process.env.API_URL)
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
    return store.dispatch(createUpdateElem(nameSpace, apiPath, data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('createUpdateElem() -> CREATE Failure', () => {
    const data = { title: 'New website' };
    nock(process.env.API_URL)
      .post(apiPath, data)
      // .post(apiPath, body => body === '[object FormData]')
      .reply(500, {});

    const expectedActions = [];
    const store = mockStore({});
    return store.dispatch(createUpdateElem(nameSpace, apiPath, data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> UPDATE Success', () => {
    const id = 15;
    const data = { title: 'Changed title' };
    nock(process.env.API_URL)
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
    return store.dispatch(createUpdateElem(nameSpace, apiPath, data, id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('createUpdateElem() -> UPDATE Failure', () => {
    const id = 15;
    const data = { title: 'Changed title' };
    nock(process.env.API_URL)
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
    return store.dispatch(createUpdateElem(nameSpace, apiPath, data, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('createUpdateElem() -> File in data should be sent as multipart/form-data', () => {
    const id = 15;
    const data = { title: 'New term', file: { name: 'newfile.jpg' } };
    nock(process.env.API_URL)
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
    return store.dispatch(createUpdateElem(nameSpace, apiPath, data, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('deleteElem() -> DELETE Success', () => {
    const id = 15;
    nock(process.env.API_URL)
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
    return store.dispatch(deleteElem(nameSpace, apiPath, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('deleteElem() -> DELETE Failures', () => {
    const id = 15;
    nock(process.env.API_URL)
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
    return store.dispatch(deleteElem(nameSpace, apiPath, 15))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });


  it('deleteElem() -> camelCase nameSPace should be changes to lowercase in API call', () => {
    const camelCaseNameSpace = 'subscriptionTerms';
    const apiPathAlt = '/api/v1/subscriptionterms/';
    const id = 15;
    nock(process.env.API_URL)
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
    return store.dispatch(deleteElem(camelCaseNameSpace, apiPathAlt, 15))
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
});
