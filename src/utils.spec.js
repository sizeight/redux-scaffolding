import expect from 'expect';

import { shouldFetch } from './utils';


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
});
