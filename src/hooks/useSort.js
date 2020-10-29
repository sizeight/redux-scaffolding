import { useEffect, useState, useCallback } from 'react';

// Custom hook
function useSort(objArr) {
  const [initialArr, setInitialArr] = useState(objArr);
  const [sortedArr, setSortedArr] = useState(objArr);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  // const [filterValue, setFilterValue] = useState('');

  function propExists(obj, sortKeys) {
    return !!sortKeys.split('__').reduce(
      (ob, key) => {
        if (ob && Object.prototype.hasOwnProperty.call(ob, key)) {
          if (ob[key] === undefined || ob[key] === null || ob[key] === 0) {
            // The property exists, but it has a value of undefined or null or 0
            return true;
          }
          return ob[key];
        }
        return undefined;
      },
      obj,
    );
  }

  function propValue(obj, sortKeys) {
    let value = obj;
    sortKeys.split('__').forEach((key) => {
      value = value[key];
    }, obj);
    return value;
  }

  // If descending or ascending sort required, return sorted elements else just return elems.
  const getSortedElems = useCallback(
    (elems, key, direction) => {
      let sortedElems = elems.slice();
      if (key !== null && direction !== null) {
        sortedElems = sortedElems.sort((a, b) => {
          const aHasKey = propExists(a, key);
          const bHasKey = propExists(b, key);

          if (!aHasKey || !bHasKey) {
            throw new Error(`Object has no key ${key}`);
          }

          let valA = propValue(a, key); // ignore upper and lowercase
          let valB = propValue(b, key); // ignore upper and lowercase

          if (typeof valA === 'number' && typeof valB === 'number') {
            // Sort integers
            return direction === 'asc' ? (valA - valB) : (valB - valA);
          }

          if (typeof valA === 'string' && typeof valB === 'string') {
            // Sort strings
            valA = valA.toUpperCase(); // ignore upper and lowercase
            valB = valB.toUpperCase(); // ignore upper and lowercase
            if (valA < valB) {
              return direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
              return direction === 'asc' ? 1 : -1;
            }
          } else if (valA === undefined || valA === null) {
            return direction === 'asc' ? -1 : 1;
          } else if (valB === undefined || valB === null) {
            return direction === 'asc' ? 1 : -1;
          }

          // case where values are equal
          return 0;
        });
      }
      return sortedElems;
    },
    [],
  );

  function handleSort(key) {
    let newSortKey = key;
    let newSortDirection = 'asc';
    if (key === sortKey) {
      if (sortDirection === 'asc') {
        newSortKey = key;
        newSortDirection = 'desc';
      } else {
        newSortKey = null;
        newSortDirection = null;
      }
    }
    setSortKey(newSortKey); // null (when unsorted) or a string (when asc or desc)
    setSortDirection(newSortDirection); // unsorted => asc => desc => unsorted
  }

  /*
   * If sortKey, sortDirection, initialArr change, reort to make sure sortedArr is up to date.
   */
  useEffect(
    () => {
      if (sortKey === null && sortDirection === null) {
        setSortedArr(initialArr);
      } else if (sortKey === null || sortDirection === null) {
        // nada
      } else {
        const newSortedArr = getSortedElems(initialArr, sortKey, sortDirection);
        setSortedArr(newSortedArr);
      }
    },
    [sortKey, sortDirection, initialArr, getSortedElems],
  );

  /*
   * Whenever the input arr changes in calling component, reset initial array.
   */
  useEffect(
    () => {
      setInitialArr(objArr);
    },
    [objArr],
  );

  return {
    sortedArr,
    sortKey,
    sortDirection,
    handleSort,
  };
}

export default useSort;
