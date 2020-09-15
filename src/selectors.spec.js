import expect from 'expect';
import rewire from 'rewire';

import {
  getStateElems,
  getUpdateId,
  getFilterValue,
  getFetchingComplete,
  getUpToDate,
  getElems,
  getAllElems,
  getElemToUpdate,
  getUpdateBusyIds,
  getDeleteId,
  getDeleteBusyIds,
  getSortKey,
  getExpandId,
  getSortDirection,
  getPagination,
  getExtraInfo,
  getTotalElemCount,
  getFilteredElemCount,
} from './selectors';

// Selector functions not exported need to be rewired to test
const selectors = rewire('./selectors');
const getFilteredElems = selectors.__get__('getFilteredElems'); /* eslint-disable-line no-underscore-dangle */
const getSortedElems = selectors.__get__('getSortedElems'); /* eslint-disable-line no-underscore-dangle */

const nameSpace = 'posts';

describe('selectors -> reduxBaseElem', () => {
  it('getStateElems()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
      },
    };
    const derivedData = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      posts: [],
    };
    expect(getStateElems(nameSpace, state)).toEqual(derivedData);
  });

  it('getUpdateId()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        updateId: 2,
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        updateId: undefined,
      },
    };
    const derivedData = 2;
    expect(getUpdateId(nameSpace, state)).toEqual(derivedData);
  });

  it('getUpdateBusyIds()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        updateBusyIds: [6],
        deleteBusyIds: [],
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        updateBusyIds: [],
        deleteBusyIds: [],
      },
    };
    const derivedData = [6];
    expect(getUpdateBusyIds(nameSpace, state)).toEqual(derivedData);
  });

  it('getDeleteId()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        deleteId: 2,
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        deleteId: -2,
      },
    };
    const derivedData = 2;
    expect(getDeleteId(nameSpace, state)).toEqual(derivedData);
  });

  it('getDeleteBusyIds()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        updateBusyIds: [6],
        deleteBusyIds: [],
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        updateBusyIds: [],
        deleteBusyIds: [],
      },
    };
    const derivedData = [];
    expect(getDeleteBusyIds(nameSpace, state)).toEqual(derivedData);
  });

  it('getFilterValue()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        updateId: 2,
        filterValue: 'Some text',
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        updateId: undefined,
        filterValue: '',
      },
    };
    const derivedData = 'Some text';
    expect(getFilterValue(nameSpace, state)).toEqual(derivedData);
  });

  it('getSortKey()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        updateId: 2,
        filterValue: 'Some text',
        sortKey: 'title',
        sortDirection: 'asc',
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        updateId: undefined,
        filterValue: '',
        sortKey: undefined,
        sortDirection: undefined,
      },
    };
    const derivedData = 'title';
    expect(getSortKey(nameSpace, state)).toEqual(derivedData);
  });

  it('getSortDirection()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
        updateId: 2,
        filterValue: 'Some text',
        sortKey: 'title',
        sortDirection: 'asc',
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
        updateId: undefined,
        filterValue: '',
        sortKey: undefined,
        sortDirection: undefined,
      },
    };
    const derivedData = 'asc';
    expect(getSortDirection(nameSpace, state)).toEqual(derivedData);
  });

  it('getExpandId()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        posts: [],
        expandId: 15,
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        websites: [],
        expandId: -2,
      },
    };
    const derivedData = 15;
    expect(getExpandId(nameSpace, state)).toEqual(derivedData);
  });

  it('getPagination()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
        pagination: {
          count: 115,
          previous: null,
          page: 1,
          next: 2,
        },
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
      },
    };
    const derivedData = {
      count: 115,
      previous: null,
      page: 1,
      next: 2,
    };
    expect(getPagination(nameSpace, state)).toEqual(derivedData);
  });

  it('getExtraInfo()', () => {
    const state = {
      posts: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
        extraInfo: {
          something: 'extra',
        },
      },
      websites: {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: [],
      },
    };
    const derivedData = {
      something: 'extra',
    };
    expect(getExtraInfo(nameSpace, state)).toEqual(derivedData);
  });


  it('getFilteredElems() -> fetching complete, filterValue = "Ha"', () => {
    const filterValue = 'ha';
    const elems = [
      {
        id: 1,
        filterString: 'alpha',
      },
      {
        id: 2,
        filterString: 'bravo',
      },
      {
        id: 3,
        filterString: 'charlie',
      },
    ];
    const derivedData = [
      {
        id: 1,
        filterString: 'alpha',
      },
      {
        id: 3,
        filterString: 'charlie',
      },
    ];
    expect(getFilteredElems(elems, filterValue)).toEqual(derivedData);
  });

  it('getFilteredElems() -> fetching complete, filterValue = ""', () => {
    const filterValue = '';
    const elems = [
      {
        id: 1,
        filterString: 'alpha',
      },
      {
        id: 2,
        filterString: 'bravo',
      },
      {
        id: 3,
        filterString: 'charlie',
      },
    ];
    const derivedData = [
      {
        id: 1,
        filterString: 'alpha',
      },
      {
        id: 2,
        filterString: 'bravo',
      },
      {
        id: 3,
        filterString: 'charlie',
      },
    ];
    expect(getFilteredElems(elems, filterValue)).toEqual(derivedData);
  });

  it('getFilteredElems() -> fetching complete, No filterString fields in reducer', () => {
    const filterValue = 'ha';
    const elems = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];
    const derivedData = [];
    expect(getFilteredElems(elems, filterValue)).toEqual(derivedData);
  });


  it('getSortedElems() -> No sort required', () => {
    const sortKey = null;
    const sortDirection = null;
    const elems = [
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Delta',
      },
      {
        title: 'Alpha',
      },
    ];
    const derivedData = [
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Delta',
      },
      {
        title: 'Alpha',
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Invalid sortKey provided', () => {
    const sortKey = 'wrongKey';
    const sortDirection = 'asc';
    const elems = [
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Delta',
      },
      {
        title: 'Alpha',
      },
    ];
    expect(() => getSortedElems(elems, sortKey, sortDirection))
      .toThrow(new Error('Object has no key wrongKey'));
  });

  it('getSortedElems() -> Nested sortKey provided "author__first_name"', () => {
    const sortKey = 'author__first_name';
    const sortDirection = 'asc';
    const elems = [
      {
        id: 1,
        author: {
          first_name: 'Charlie',
        },
      },
      {
        id: 2,
        author: {
          first_name: 'Alpha',
        },
      },
      {
        id: 3,
        author: {
          first_name: 'Bravo',
        },
      },
      {
        id: 4,
        author: {
          first_name: 'Delta',
        },
      },
    ];
    const derivedData = [
      {
        id: 2,
        author: {
          first_name: 'Alpha',
        },
      },
      {
        id: 3,
        author: {
          first_name: 'Bravo',
        },
      },
      {
        id: 1,
        author: {
          first_name: 'Charlie',
        },
      },
      {
        id: 4,
        author: {
          first_name: 'Delta',
        },
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Ascending strings', () => {
    const sortKey = 'title';
    const sortDirection = 'asc';
    const elems = [
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Delta',
      },
      {
        title: 'Alpha',
      },
    ];
    const derivedData = [
      {
        title: 'Alpha',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Charlie',
      },
      {
        title: 'Delta',
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Descending strings', () => {
    const sortKey = 'title';
    const sortDirection = 'desc';
    const elems = [
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Delta',
      },
      {
        title: 'Alpha',
      },
    ];
    const derivedData = [
      {
        title: 'Delta',
      },
      {
        title: 'Charlie',
      },
      {
        title: 'Bravo',
      },
      {
        title: 'Alpha',
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Ascending numbers', () => {
    const sortKey = 'number';
    const sortDirection = 'asc';
    const elems = [
      {
        number: 3,
      },
      {
        number: 1,
      },
      {
        number: 4,
      },
      {
        number: 2,
      },
    ];
    const derivedData = [
      {
        number: 1,
      },
      {
        number: 2,
      },
      {
        number: 3,
      },
      {
        number: 4,
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Descending numbers', () => {
    const sortKey = 'number';
    const sortDirection = 'desc';
    const elems = [
      {
        number: 3,
      },
      {
        number: 1,
      },
      {
        number: 4,
      },
      {
        number: 2,
      },
    ];
    const derivedData = [
      {
        number: 4,
      },
      {
        number: 3,
      },
      {
        number: 2,
      },
      {
        number: 1,
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Ascending mixed types', () => {
    const sortKey = 'number';
    const sortDirection = 'asc';
    const elems = [
      {
        id: 3,
        number: 3,
      },
      {
        id: 1,
        number: 1,
      },
      {
        id: 4,
        number: null,
      },
      {
        id: 2,
        number: 2,
      },
    ];
    const derivedData = [
      {
        id: 4,
        number: null,
      },
      {
        id: 1,
        number: 1,
      },
      {
        id: 2,
        number: 2,
      },
      {
        id: 3,
        number: 3,
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> Descending mixed types', () => {
    const sortKey = 'number';
    const sortDirection = 'desc';
    const elems = [
      {
        id: 3,
        number: 3,
      },
      {
        id: 1,
        number: 1,
      },
      {
        id: 4,
        number: null,
      },
      {
        id: 2,
        number: 2,
      },
    ];
    const derivedData = [
      {
        id: 3,
        number: 3,
      },
      {
        id: 2,
        number: 2,
      },
      {
        id: 1,
        number: 1,
      },
      {
        id: 4,
        number: null,
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });

  it('getSortedElems() -> values of 0', () => {
    const sortKey = 'unique_logins_last_x_days';
    const sortDirection = 'asc';
    const elems = [
      {
        id: 3,
        unique_logins_last_x_days: 0,
      },
      {
        id: 1,
        unique_logins_last_x_days: 0,
      },
      {
        id: 4,
        unique_logins_last_x_days: 0,
      },
      {
        id: 2,
        unique_logins_last_x_days: 0,
      },
    ];
    const derivedData = [
      {
        id: 3,
        unique_logins_last_x_days: 0,
      },
      {
        id: 1,
        unique_logins_last_x_days: 0,
      },
      {
        id: 4,
        unique_logins_last_x_days: 0,
      },
      {
        id: 2,
        unique_logins_last_x_days: 0,
      },
    ];
    expect(getSortedElems(elems, sortKey, sortDirection)).toEqual(derivedData);
  });


  it('getElems() -> Fetching complete', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      elems: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      filterValue: '',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];
    expect(getElems(stateElems)).toEqual(derivedData);
  });

  it('getElems() -> Fetching complete, filter applied', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      elems: [
        {
          id: 1,
          title: 'Alpha',
          filterString: 'alpha',
        },
        {
          id: 2,
          title: 'Beta',
          filterString: 'beta',
        },
      ],
      filterOnFields: ['title'],
      filterValue: 'bet',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = [
      {
        id: 2,
        title: 'Beta',
        filterString: 'beta',
      },
    ];
    expect(getElems(stateElems)).toEqual(derivedData);
  });


  it('getAllElems() -> Fetching complete, filter applied', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      elems: [
        {
          id: 1,
          title: 'Alpha',
          filterString: 'alpha',
        },
        {
          id: 2,
          title: 'Beta',
          filterString: 'beta',
        },
      ],
      filterOnFields: ['title'],
      filterValue: 'bet',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = [
      {
        id: 1,
        title: 'Alpha',
        filterString: 'alpha',
      },
      {
        id: 2,
        title: 'Beta',
        filterString: 'beta',
      },
    ];
    expect(getAllElems(stateElems)).toEqual(derivedData);
  });


  it('getFetchingComplete() -> Fetching complete', () => {
    const elems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const derivedData = true;
    expect(getFetchingComplete(elems)).toEqual(derivedData);
  });

  it('getFetchingComplete() -> Fetching not complete', () => {
    const invites = {
      isFetching: true,
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const derivedData = false;
    expect(getFetchingComplete(invites)).toEqual(derivedData);
  });


  it('getUpToDate() -> Fetching complete', () => {
    const elems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const derivedData = true;
    expect(getUpToDate(elems)).toEqual(derivedData);
  });

  it('getUpToDate() -> Fetching complete, didInvalidate', () => {
    const elems = {
      isFetching: false,
      didInvalidate: true,
      lastUpdated: Date.now(),
    };
    const derivedData = false;
    expect(getUpToDate(elems)).toEqual(derivedData);
  });

  it('getUpToDate() -> Not updated yet', () => {
    const elems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: undefined,
    };
    const derivedData = false;
    expect(getUpToDate(elems)).toEqual(derivedData);
  });


  it('getElemToUpdate() -> UPDATE', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      updateId: 2,
      elems: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
      filterValue: '',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = {
      id: 2,
    };
    expect(getElemToUpdate(stateElems)).toEqual(derivedData);
  });

  it('getElemToUpdate() -> CREATE (empty object)', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      updateId: -1,
      elems: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
      filterValue: '',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = {};
    expect(getElemToUpdate(stateElems)).toEqual(derivedData);
  });


  it('getTotalElemCount() -> How many elements are there in total?', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      elems: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
      filterValue: '',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = 2;
    expect(getTotalElemCount(stateElems)).toEqual(derivedData);
  });

  it('getTotalElemCount() -> If fetching, still return the count', () => {
    const stateElems = {
      isFetching: true,
      didInvalidate: false,
      lastUpdated: undefined,
      elems: [],
      filterValue: '',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = 0;
    expect(getTotalElemCount(stateElems)).toEqual(derivedData);
  });

  it('getFilteredElemCount() -> How many filtered elements are there?', () => {
    const stateElems = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
      elems: [
        {
          id: 1,
          filterString: 'jerry seinfeld',
        },
        {
          id: 2,
          filterString: 'cosmo kramer',
        },
        {
          id: 3,
          filterString: 'george costanza',
        },
      ],
      filterValue: 'Cos',
      sortKey: null,
      sortDirection: null,
    };
    const derivedData = 2;
    expect(getFilteredElemCount(stateElems)).toEqual(derivedData);
  });
});
