import expect from 'expect';
import { renderHook, act } from '@testing-library/react-hooks';
import useSort from './useSort';

describe('hooks -> useSort()', () => {
  it('useSort()', () => {
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

    const { result } = renderHook(() => useSort(objArr));

    expect(result.current.sortedArr).toEqual(objArr);
    expect(result.current.sortKey).toEqual(null);
    expect(result.current.sortDirection).toEqual(null);
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('firstName') 1x", () => {
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
      {
        firstName: '',
        lastName: 'Newman',
      },
    ];
    const sortedArr = [
      {
        firstName: '',
        lastName: 'Newman',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
    ];

    const { result } = renderHook(() => useSort(objArr));

    act(() => {
      result.current.handleSort('firstName');
    });

    expect(result.current.sortedArr).toEqual(sortedArr);
    expect(result.current.sortKey).toEqual('firstName');
    expect(result.current.sortDirection).toEqual('asc');
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('age') 1x (number)", () => {
    const objArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
        age: 39,
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
        age: 42,
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
        age: 40,
      },
    ];
    const sortedArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
        age: 39,
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
        age: 40,
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
        age: 42,
      },
    ];

    const { result } = renderHook(() => useSort(objArr));

    act(() => {
      result.current.handleSort('age');
    });

    expect(result.current.sortedArr).toEqual(sortedArr);
    expect(result.current.sortKey).toEqual('age');
    expect(result.current.sortDirection).toEqual('asc');
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('firstName') 2x", () => {
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
    const sortedArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
    ];

    const { result } = renderHook(() => useSort(objArr));

    act(() => {
      result.current.handleSort('firstName');
    });
    act(() => {
      result.current.handleSort('firstName');
    });

    expect(result.current.sortedArr).toEqual(sortedArr);
    expect(result.current.sortKey).toEqual('firstName');
    expect(result.current.sortDirection).toEqual('desc');
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('firstName') 3x", () => {
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

    const { result } = renderHook(() => useSort(objArr));

    act(() => {
      result.current.handleSort('firstName');
    });
    act(() => {
      result.current.handleSort('firstName');
    });
    act(() => {
      result.current.handleSort('firstName');
    });

    expect(result.current.sortedArr).toEqual(objArr);
    expect(result.current.sortKey).toEqual(null);
    expect(result.current.sortDirection).toEqual(null);
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('firstName'), handleSort('lastName')", () => {
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
    const sortedArr = [
      {
        firstName: 'George',
        lastName: 'Costanza',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
    ];

    const { result } = renderHook(() => useSort(objArr));

    act(() => {
      result.current.handleSort('firstName');
    });
    act(() => {
      result.current.handleSort('lastName');
    });

    expect(result.current.sortedArr).toEqual(sortedArr);
    expect(result.current.sortKey).toEqual('lastName');
    expect(result.current.sortDirection).toEqual('asc');
    expect(typeof result.current.handleSort).toBe('function');
  });

  it("useSort() -> handleSort('firstName') then change objArr", () => {
    let objArr = [
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
    const sortedArr = [
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
    ];

    const { result, rerender } = renderHook(() => useSort(objArr));

    // sort by firstName
    act(() => {
      result.current.handleSort('firstName');
    });

    // initial objArr changes
    objArr = [
      {
        firstName: 'Jerry',
        lastName: 'Seinfeld',
      },
      {
        firstName: 'Cosmo',
        lastName: 'Kramer',
      },
    ];

    // rerender to make it take effect
    rerender();

    expect(result.current.sortedArr).toEqual(sortedArr);
    expect(result.current.sortKey).toEqual('firstName');
    expect(result.current.sortDirection).toEqual('asc');
    expect(typeof result.current.handleSort).toBe('function');
  });
});
