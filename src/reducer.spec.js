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
      responseElemsKey: undefined,
      updateId: -1,
      filterValue: '',
      sortKey: null,
      sortDirection: null,
      pagination: {},
      extraInfo: {},
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

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Alternative responseElemsKey provided, not paginated`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        facets: [
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
      responseElemsKey: 'facets',
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      responseElemsKey: 'facets',
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
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Alternative responseElemsKey provided with extra info, not paginated`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        total_count: 110,
        facets: [
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
      responseElemsKey: 'facets',
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      responseElemsKey: 'facets',
      pagination: {},
      extraInfo: {
        total_count: 110,
      },
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

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Alternative responseElemsKey for pagination`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        count: 115,
        next: 'http://www.xyz.com/api/v1/search/?q=gold+AND+silver&limit=10&offset=10',
        previous: null,
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
      responseElemsKey: 'results',
      extraInfo: {},
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      responseElemsKey: 'results',
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
      extraInfo: {
        count: 115, // Number of results
        next: 'http://www.xyz.com/api/v1/search/?q=gold+AND+silver&limit=10&offset=10',
        previous: null,
      },
      pagination: {
        count: 115, // Number of results
        next: 'http://www.xyz.com/api/v1/search/?q=gold+AND+silver&limit=10&offset=10',
        previous: null,
        nextParams: '?q=gold+AND+silver&limit=10&offset=10',
        previousParams: null,
        pageSize: 10,
        pageCount: 12,
        pageNumber: 0, // 0 indexed
        pages: [
          {
            pageNumber: 0,
            active: true,
            params: '?q=gold+AND+silver&limit=10&offset=0',
          },
          {
            pageNumber: 1,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=10',
          },
          {
            pageNumber: 2,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=20',
          },
          {
            pageNumber: 3,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=30',
          },
          {
            pageNumber: 4,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=40',
          },
          {
            pageNumber: 5,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=50',
          },
          {
            pageNumber: 6,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=60',
          },
          {
            pageNumber: 7,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=70',
          },
          {
            pageNumber: 8,
            active: false,
            params: '?q=gold+AND+silver&limit=10&offset=80',
          },
        ],

      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Alternative responseElemsKey for pagination (2 pages, next=null, previous='...')`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        count: 12,
        next: null,
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10',
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
      responseElemsKey: 'results',
      extraInfo: {},
      pagination: {},
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      responseElemsKey: 'results',
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
      extraInfo: {
        count: 12, // Number of results
        next: null,
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10',
      },
      pagination: {
        count: 12, // Number of results
        next: null,
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10',
        nextParams: null,
        previousParams: '?q=gold&limit=10',
        pageSize: 10,
        pageCount: 2,
        pageNumber: 1, // 0 indexed
        pages: [
          {
            pageNumber: 0,
            active: false,
            params: '?q=gold&limit=10&offset=0',
          },
          {
            pageNumber: 1,
            active: true,
            params: '?q=gold&limit=10&offset=10',
          },
        ],

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

  it(`should handle ${nameSpace}/FETCH_SUCCESS -> Alternative responseElemsKey for pagination AND append = true`, () => {
    const action = {
      type: 'websites/FETCH_SUCCESS',
      elems: {
        count: 35,
        next: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=20',
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=0',
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
      responseElemsKey: 'results',
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
      extraInfo: {
        count: 35,
        next: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=10',
        previous: null,
      },
      pagination: {
        count: 35,
        next: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=10',
        previous: null,
        pageCount: 4,
        pageNumber: 1,
        pageSize: 10,
      },
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: expect.any(Number), // Date.now(),
      filterOnFields: ['title', 'sub_title'],
      responseElemsKey: 'results',
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
      extraInfo: {
        count: 35,
        next: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=20',
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=0',
      },
      pagination: {
        count: 35,
        next: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=20',
        previous: 'http://www.xyz.com/api/v1/search/?q=gold&limit=10&offset=0',
        nextParams: '?q=gold&limit=10&offset=20',
        previousParams: '?q=gold&limit=10&offset=0',
        pageCount: 4,
        pageNumber: 1,
        pageSize: 10,
        pages: [
          {
            active: false,
            pageNumber: 0,
            params: '?q=gold&limit=10&offset=0',
          },
          {
            active: true,
            pageNumber: 1,
            params: '?q=gold&limit=10&offset=10',
          },
          {
            active: false,
            pageNumber: 2,
            params: '?q=gold&limit=10&offset=20',
          },
          {
            active: false,
            pageNumber: 3,
            params: '?q=gold&limit=10&offset=30',
          },
        ],
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
