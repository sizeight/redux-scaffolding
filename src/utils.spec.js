import expect from 'expect';

import {
  fetchingComplete, upToDate, upToDateButFetching, shouldFetch,
} from './utils';


describe('Utils', () => {
  it('shouldFetch(): not in state', () => {
    const state = undefined;
    const expectedResult = true;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): already fetching', () => {
    const state = {
      isFetching: true,
      lastUpdated: Date.now(),
    };
    const expectedResult = false;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): not up to date', () => {
    const state = {
      isFetching: false,
      lastUpdated: undefined,
    };
    const expectedResult = true;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): fetched more than 5 mins ago', () => {
    const state = {
      isFetching: false,
      lastUpdated: Date.now() - 300001,
      didInvalidate: false,
    };
    const expectedResult = true;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): invalid object', () => {
    const state = {
      isFetching: false,
      lastUpdated: Date.now(),
      didInvalidate: true,
    };
    const expectedResult = true;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): valid object already already in state', () => {
    const state = {
      isFetching: false,
      lastUpdated: Date.now(),
      didInvalidate: false,
    };
    const expectedResult = false;
    expect(shouldFetch(state)).toEqual(expectedResult);
  });

  it('shouldFetch(): false because fetched less than custom provided 15 mins ago', () => {
    const state = {
      isFetching: false,
      lastUpdated: Date.now() - (1000 * 14),
      didInvalidate: false,
    };
    const expectedResult = false;
    expect(shouldFetch(state, 15)).toEqual(expectedResult);
  });

  it('shouldFetch(): true because fetched more than custom provided 15 mins ago', () => {
    const state = {
      isFetching: false,
      lastUpdated: Date.now() - (1000 * 16),
      didInvalidate: false,
    };
    const expectedResult = true;
    expect(shouldFetch(state, 15)).toEqual(expectedResult);
  });


  it('fetchingComplete(): Not fetching and no valid elems in store', () => {
    const state = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: undefined,
    };
    const expectedResult = false;
    expect(fetchingComplete(state)).toEqual(expectedResult);
  });

  it('fetchingComplete(): Not fetching and valid elems in store.', () => {
    const state = {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const expectedResult = true;
    expect(fetchingComplete(state)).toEqual(expectedResult);
  });

  it('fetchingComplete(): Fetching and no valid elems in store', () => {
    const state = {
      isFetching: true,
      didInvalidate: false,
      lastUpdated: undefined,
    };
    const expectedResult = false;
    expect(fetchingComplete(state)).toEqual(expectedResult);
  });

  it('fetchingComplete(): Fetching and valid elems in store.', () => {
    const state = {
      isFetching: true,
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const expectedResult = false;
    expect(fetchingComplete(state)).toEqual(expectedResult);
  });


  it('upToDate(): No valid elems in store', () => {
    const state = {
      didInvalidate: false,
      lastUpdated: undefined,
    };
    const expectedResult = false;
    expect(upToDate(state)).toEqual(expectedResult);
  });

  it('upToDate(): Valid elems in store.', () => {
    const state = {
      didInvalidate: false,
      lastUpdated: Date.now(),
    };
    const expectedResult = true;
    expect(upToDate(state)).toEqual(expectedResult);
  });
});
