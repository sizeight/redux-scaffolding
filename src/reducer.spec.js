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
      updateId: -2,
      deleteId: -2,
      filterValue: '',
      sortKey: null,
      sortDirection: null,
      expandId: -2,
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

  // FETCH_SUCCESS
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
        queryParams: {
          q: 'gold+AND+silver',
        },
        nextQueryParamsString: '?q=gold+AND+silver&limit=10&offset=10',
        nextQueryParams: {
          q: 'gold+AND+silver',
          limit: 10,
          offset: 10,
        },
        previousQueryParamsString: null,
        previousQueryParams: null,
        pageSize: 10,
        pageCount: 12,
        pageNumber: 0, // 0 indexed
        pages: [
          {
            pageNumber: 0,
            active: true,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=0',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 0,
            },
          },
          {
            pageNumber: 1,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=10',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 10,
            },
          },
          {
            pageNumber: 2,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=20',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 20,
            },
          },
          {
            pageNumber: 3,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=30',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 30,
            },
          },
          {
            pageNumber: 4,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=40',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 40,
            },
          },
          {
            pageNumber: 5,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=50',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 50,
            },
          },
          {
            pageNumber: 6,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=60',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 60,
            },
          },
          {
            pageNumber: 7,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=70',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 70,
            },
          },
          {
            pageNumber: 8,
            active: false,
            queryParamsString: '?q=gold+AND+silver&limit=10&offset=80',
            queryParams: {
              q: 'gold+AND+silver',
              limit: 10,
              offset: 80,
            },
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
        queryParams: {
          q: 'gold',
        },
        nextQueryParamsString: null,
        nextQueryParams: null,
        previousQueryParamsString: '?q=gold&limit=10',
        previousQueryParams: {
          q: 'gold',
          limit: 10,
        },
        pageSize: 10,
        pageCount: 2,
        pageNumber: 1, // 0 indexed
        pages: [
          {
            pageNumber: 0,
            active: false,
            queryParamsString: '?q=gold&limit=10&offset=0',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 0,
            },
          },
          {
            pageNumber: 1,
            active: true,
            queryParamsString: '?q=gold&limit=10&offset=10',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 10,
            },
          },
        ],

      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  // FETCH_SUCCESS append = true
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
        queryParams: {
          q: 'gold',
        },
        nextQueryParamsString: '?q=gold&limit=10&offset=20',
        nextQueryParams: {
          q: 'gold',
          limit: 10,
          offset: 20,
        },
        previousQueryParamsString: '?q=gold&limit=10&offset=0',
        previousQueryParams: {
          q: 'gold',
          limit: 10,
          offset: 0,
        },
        pageCount: 4,
        pageNumber: 1,
        pageSize: 10,
        pages: [
          {
            active: false,
            pageNumber: 0,
            queryParamsString: '?q=gold&limit=10&offset=0',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 0,
            },
          },
          {
            active: true,
            pageNumber: 1,
            queryParamsString: '?q=gold&limit=10&offset=10',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 10,
            },
          },
          {
            active: false,
            pageNumber: 2,
            queryParamsString: '?q=gold&limit=10&offset=20',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 20,
            },
          },
          {
            active: false,
            pageNumber: 3,
            queryParamsString: '?q=gold&limit=10&offset=30',
            queryParams: {
              q: 'gold',
              limit: 10,
              offset: 30,
            },
          },
        ],
      },
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  // FETCH_FAILURE
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

  // RESET STATE
  it(`should handle ${nameSpace}/RESET_STATE`, () => {
    const action = {
      type: 'websites/RESET_STATE',
    };
    const stateBefore = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: undefined,
      elems: [
        { id: 1 },
        { id: 2 },
      ],
      filterOnFields: [],
      responseElemsKey: undefined,
      updateId: 3,
      deletId: 9,
      filterValue: 'alpha',
      sortKey: null,
      sortDirection: null,
      expandId: 5,
      pagination: {},
      extraInfo: {},
      updateBusyIds: [],
      deleteBusyIds: [],
    };
    const stateAfter = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: undefined,
      elems: [],
      filterOnFields: [],
      responseElemsKey: undefined,
      updateId: -2,
      deleteId: -2,
      filterValue: '',
      sortKey: null,
      sortDirection: null,
      expandId: -2,
      pagination: {},
      extraInfo: {},
      updateBusyIds: [],
      deleteBusyIds: [],
    };
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  // SET_UPDATE_ID
  it(`should handle ${nameSpace}/SET_UPDATE_ID`, () => {
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

  // UPDATE_SUCCESS
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

  // SET_UPDATE_BUSY_ID
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

  // SET_DELETE_ID
  it(`should handle ${nameSpace}/SET_DELETE_ID`, () => {
    const action = {
      type: 'websites/SET_DELETE_ID',
      id: 15,
    };
    const stateBefore = {
      deleteId: -1,
    };
    const stateAfter = {
      deleteId: 15,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  // SET_DELETE_BUSY_ID
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

  // SET_FILTER_VALUE
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

  // SET_SORT_KEY
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

  // SET_EXPANDID
  it(`should handle ${nameSpace}/SET_EXPAND_ID -> 1, from all collapsed to 1 expanded`, () => {
    const action = {
      type: 'websites/SET_EXPAND_ID',
      expandId: 1,
    };
    const stateBefore = {
      expandId: -2,
    };
    const stateAfter = {
      expandId: 1,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_EXPAND_ID -> 1, from 1 expanded to all collapsed`, () => {
    const action = {
      type: 'websites/SET_EXPAND_ID',
      expandId: 1,
    };
    const stateBefore = {
      expandId: -1,
    };
    const stateAfter = {
      expandId: 1,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_EXPAND_ID -> 1, from all expanded to 1 expanded`, () => {
    const action = {
      type: 'websites/SET_EXPAND_ID',
      expandId: 1,
    };
    const stateBefore = {
      expandId: 1,
    };
    const stateAfter = {
      expandId: -2,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_EXPAND_ID -> from all expanded to all collapsed`, () => {
    const action = {
      type: 'websites/SET_EXPAND_ID',
      expandId: -1,
    };
    const stateBefore = {
      expandId: -1,
    };
    const stateAfter = {
      expandId: -2,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });

  it(`should handle ${nameSpace}/SET_EXPAND_ID -> from all collapsed to all expanded`, () => {
    const action = {
      type: 'websites/SET_EXPAND_ID',
      expandId: -1,
    };
    const stateBefore = {
      expandId: -2,
    };
    const stateAfter = {
      expandId: -1,
    };
    deepFreeze(stateBefore);
    expect(reducer(nameSpace, stateBefore, action)).toEqual(stateAfter);
  });
});
