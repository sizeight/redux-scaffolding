import expect from 'expect';
import deepFreeze from 'deep-freeze';

import { elems as reducer } from './reducer';


const nameSpace = 'websites';

describe('reducer -> reduxBaseElem', () => {
  it('should return the initial state', () => {
    const action = {};
    const stateBefore = undefined;
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: undefined,
      elems: [],
      filterOnFields: [],
      updateId: -1,
      filterValue: '',
      sortKey: null,
      sortDirection: null,
      pagination: {},
      updateBusyIds: [],
      deleteBusyIds: [],
    };
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_BUSY`, () => {
    const action = {
      type: 'websites/FETCH_BUSY',
    };
    const stateBefore = {
      isFetching: false,
    };
    const stateAfter = {
      isFetching: true,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
        },
      ],
      append: false,
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
      lastUpdated: undefined,
      filterOnFields: ['title', 'sub_title'],
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
      ],
      pagination: {},
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Invalid filterOnFields provided`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: [
        {
          id: 1,
          title: 'Alpha',
        },
        {
          id: 2,
          title: 'Bravo',
        },
      ],
      append: false,
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
      lastUpdated: undefined,
      filterOnFields: ['sub_title'],
      pagination: {},
    };
    deepFreeze(stateBefore);
    expect(() => reducer(nameSpace, stateBefore, action))
      .toThrow(new Error("Object has no key 'sub_title'"));
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> with pagination`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        count: 115,
        page_size: 10,
        previous: null,
        page: 1,
        next: 2,
        results: [
          {
            id: 1,
            title: 'Alpha',
            sub_title: 'Charlie',
          },
          {
            id: 2,
            title: 'Bravo',
            sub_title: 'Delta',
          },
        ],
      },
      append: false,
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
      lastUpdated: undefined,
      filterOnFields: ['title', 'sub_title'],
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
      ],
      pagination: {
        count: 115, // Number of results
        page_size: 10,
        previous: null,
        page: 1,
        next: 2,
      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> append = true`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: [
        {
          id: 3,
          title: 'Echo',
          sub_title: 'Golf',
        },
        {
          id: 4,
          title: 'Foxtrot',
          sub_title: 'Hotel',
        },
      ],
      append: true,
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
      lastUpdated: undefined,
      filterOnFields: ['title', 'sub_title'],
      pagination: {},
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
      ],
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
        {
          id: 3,
          title: 'Echo',
          sub_title: 'Golf',
          filterString: 'echo golf',
        },
        {
          id: 4,
          title: 'Foxtrot',
          sub_title: 'Hotel',
          filterString: 'foxtrot hotel',
        },
      ],
      pagination: {},
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> with pagination, append = true`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        count: 115,
        page_size: 10,
        previous: 1,
        page: 2,
        next: 3,
        results: [
          {
            id: 3,
            title: 'Echo',
            sub_title: 'Golf',
          },
          {
            id: 4,
            title: 'Foxtrot',
            sub_title: 'Hotel',
          },
        ],
      },
      append: true,
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
      lastUpdated: undefined,
      filterOnFields: ['title', 'sub_title'],
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
      ],
      pagination: {
        count: 115,
        page_size: 10,
        previous: null,
        page: 1,
        next: 2,
      },
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      elems: [
        {
          id: 1,
          title: 'Alpha',
          sub_title: 'Charlie',
          filterString: 'alpha charlie',
        },
        {
          id: 2,
          title: 'Bravo',
          sub_title: 'Delta',
          filterString: 'bravo delta',
        },
        {
          id: 3,
          title: 'Echo',
          sub_title: 'Golf',
          filterString: 'echo golf',
        },
        {
          id: 4,
          title: 'Foxtrot',
          sub_title: 'Hotel',
          filterString: 'foxtrot hotel',
        },
      ],
      pagination: {
        count: 115, // Number of results
        page_size: 10,
        previous: 1,
        page: 2,
        next: 3,
      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_FAILURE`, () => {
    const action = {
      type: 'websites/FETCH_FAILURE',
    };
    const stateBefore = {
      isFetching: true,
      didInvalidate: true,
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: true,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/SET_UPDATE_ID -> true`, () => {
    const action = {
      type: 'websites/SET_UPDATE_ID',
      id: 15,
    };
    const stateBefore = {
      updateId: -1,
    };
    const stateAfter = {
      updateId: 15,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_UPDATE_ID -> false`, () => {
    const action = {
      type: 'websites/SET_UPDATE_ID',
      id: -1,
    };
    const stateBefore = {
      updateId: 15,
    };
    const stateAfter = {
      updateId: -1,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/UPDATE_SUCCESS -> CREATE`, () => {
    const action = {
      type: 'websites/UPDATE_SUCCESS',
      id: -1,
      elem: { id: 16, first_name: 'Jerry', last_name: 'Seinfeld' },
    };
    const stateBefore = {
      filterOnFields: ['first_name', 'last_name'],
      elems: [
        {
          id: 15,
        },
        {
          id: 14,
        },
      ],
    };
    const stateAfter = {
      filterOnFields: ['first_name', 'last_name'],
      elems: [
        {
          id: 16,
          first_name: 'Jerry',
          last_name: 'Seinfeld',
          filterString: 'jerry seinfeld',
        },
        {
          id: 15,
        },
        {
          id: 14,
        },
      ],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/UPDATE_SUCCESS -> UPDATE`, () => {
    const action = {
      type: 'websites/UPDATE_SUCCESS',
      id: 15,
      elem: { id: 15, first_name: 'Cosmo', last_name: 'Kramer' },
    };
    const stateBefore = {
      filterOnFields: ['first_name', 'last_name'],
      elems: [
        {
          id: 16,
        },
        {
          id: 15,
          first_name: 'Jerry',
          last_name: 'Seinfeld',
          filterString: 'jerry seinfeld',
        },
        {
          id: 14,
        },
      ],
    };
    const stateAfter = {
      filterOnFields: ['first_name', 'last_name'],
      elems: [
        {
          id: 16,
        },
        {
          id: 15,
          first_name: 'Cosmo',
          last_name: 'Kramer',
          filterString: 'cosmo kramer',
        },
        {
          id: 14,
        },
      ],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/UPDATE_SUCCESS -> DELETE`, () => {
    const action = {
      type: 'websites/UPDATE_SUCCESS',
      id: 15,
      elem: undefined,
    };
    const stateBefore = {
      elems: [
        {
          id: 16,
        },
        {
          id: 15,
        },
        {
          id: 14,
        },
      ],
      pagination: {},
    };
    const stateAfter = {
      elems: [
        {
          id: 16,
        },
        {
          id: 14,
        },
      ],
      pagination: {},
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/UPDATE_SUCCESS -> DELETE with pagination`, () => {
    const action = {
      type: 'websites/UPDATE_SUCCESS',
      id: 15,
      elem: undefined,
    };
    const stateBefore = {
      elems: [
        {
          id: 16,
        },
        {
          id: 15,
        },
        {
          id: 14,
        },
      ],
      pagination: {
        count: 3,
        next: null,
      },
    };
    const stateAfter = {
      elems: [
        {
          id: 16,
        },
        {
          id: 14,
        },
      ],
      pagination: {
        count: 2,
        next: null,
      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/SET_UPDATE_BUSY_ID -> true`, () => {
    const action = {
      type: 'websites/SET_UPDATE_BUSY_ID',
      id: 15,
      busy: true,
    };
    const stateBefore = {
      updateBusyIds: [9, 8],
    };
    const stateAfter = {
      updateBusyIds: [9, 8, 15],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_UPDATE_BUSY_ID -> false`, () => {
    const action = {
      type: 'websites/SET_UPDATE_BUSY_ID',
      id: 15,
      busy: false,
    };
    const stateBefore = {
      updateBusyIds: [9, 8, 15],
    };
    const stateAfter = {
      updateBusyIds: [9, 8],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/SET_DELETE_BUSY_ID -> true`, () => {
    const action = {
      type: 'websites/SET_DELETE_BUSY_ID',
      id: 15,
      busy: true,
    };
    const stateBefore = {
      deleteBusyIds: [9, 8],
    };
    const stateAfter = {
      deleteBusyIds: [9, 8, 15],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_DELETE_BUSY_ID -> false`, () => {
    const action = {
      type: 'websites/SET_DELETE_BUSY_ID',
      id: 15,
      busy: false,
    };
    const stateBefore = {
      deleteBusyIds: [9, 8, 15],
    };
    const stateAfter = {
      deleteBusyIds: [9, 8],
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/SET_FILTER_VALUE -> Lorem ipsum`, () => {
    const action = {
      type: 'websites/SET_FILTER_VALUE',
      value: 'Lorem ipsum',
    };
    const stateBefore = {
      filterValue: 'Lorem ipsu',
    };
    const stateAfter = {
      filterValue: 'Lorem ipsum',
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });


  it(`should handle ${nameSpace}/SET_SORT_KEY -> null => title, null => asc`, () => {
    const action = {
      type: 'websites/SET_SORT_KEY',
      sortKey: 'title',
    };
    const stateBefore = {
      sortKey: null,
      sortDirection: null,
    };
    const stateAfter = {
      sortKey: 'title',
      sortDirection: 'asc',
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_SORT_KEY -> title => title, asc => desc`, () => {
    const action = {
      type: 'websites/SET_SORT_KEY',
      sortKey: 'title',
    };
    const stateBefore = {
      sortKey: 'title',
      sortDirection: 'asc',
    };
    const stateAfter = {
      sortKey: 'title',
      sortDirection: 'desc',
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_SORT_KEY -> title => null, desc => null`, () => {
    const action = {
      type: 'websites/SET_SORT_KEY',
      sortKey: 'title',
    };
    const stateBefore = {
      sortKey: 'title',
      sortDirection: 'desc',
    };
    const stateAfter = {
      sortKey: null,
      sortDirection: null,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_SORT_KEY -> title => number, desc => asc`, () => {
    const action = {
      type: 'websites/SET_SORT_KEY',
      sortKey: 'number',
    };
    const stateBefore = {
      sortKey: 'title',
      sortDirection: 'desc',
    };
    const stateAfter = {
      sortKey: 'number',
      sortDirection: 'asc',
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });
});
