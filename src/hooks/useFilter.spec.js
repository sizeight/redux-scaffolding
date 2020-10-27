import expect from 'expect';
import { renderHook } from '@testing-library/react-hooks';
import useFilter from './useFilter';

describe('hooks -> useFilter()', () => {
  it('useFilter()', () => {
    const objArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
    ];
    const fields = ['lastName'];
    const filterValue = 'Kra';
    const derivedValue = [
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
    ];

    const { result } = renderHook(() => useFilter(objArr, fields, filterValue));

    expect(result.current).toEqual(derivedValue);
  });

  it('useFilter() -> invalid filterFields', () => {
    const objArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
    ];
    const fields = ['age'];
    const filterValue = 'Kra';
    const derivedValue = [
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
    ];

    const { result } = renderHook(() => useFilter(objArr, fields, filterValue));

    expect(result.current).toEqual(derivedValue);
  });

  it('useFilter() -> empty filterValue', () => {
    const objArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
    ];
    const fields = ['lastName'];
    const filterValue = '';
    const derivedValue = objArr.slice();

    const { result } = renderHook(() => useFilter(objArr, fields, filterValue));

    expect(result.current).toEqual(derivedValue);
  });

  it('useFilter() -> nested 2 deep', () => {
    const objArr = [
      {
        id: 1,
        user: {
          firstName: 'Jerry',
          lastName: 'Seinfeld',
        },
      },
      {
        id: 2,
        user: {
          firstName: 'Cosmo',
          lastName: 'Kramer',
        },
      },
      {
        id: 3,
        user: {
          firstName: 'George',
          lastName: 'Costanza',
        },
      },
    ];
    const fields = ['user__lastName'];
    const filterValue = 'Kra';
    const derivedValue = [
      {
        id: 2,
        user: {
          firstName: 'Cosmo',
          lastName: 'Kramer',
        },
      },
    ];

    const { result } = renderHook(() => useFilter(objArr, fields, filterValue));

    expect(result.current).toEqual(derivedValue);
  });

  it('useFilter() -> nested 3 deep', () => {
    const objArr = [
      {
        id: 1,
        user: {
          firstName: 'Jerry',
          lastName: 'Seinfeld',
          details: {
            favourite_color: 'Blue',
          },
        },
      },
      {
        id: 2,
        user: {
          firstName: 'Cosmo',
          lastName: 'Kramer',
          details: {
            favourite_color: 'Green',
          },
        },
      },
      {
        id: 3,
        user: {
          firstName: 'George',
          lastName: 'Costanza',
          details: {
            favourite_color: 'Blue',
          },
        },
      },
    ];
    const fields = ['user__lastName', 'user__details__favourite_color'];
    const filterValue = 'Gr';
    const derivedValue = [
      {
        id: 2,
        user: {
          firstName: 'Cosmo',
          lastName: 'Kramer',
          details: {
            favourite_color: 'Green',
          },
        },
      },
    ];

    const { result } = renderHook(() => useFilter(objArr, fields, filterValue));

    expect(result.current).toEqual(derivedValue);
  });
});

// https://github.com/testing-library/react-hooks-testing-library
/*
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)
})
*/
