/*
 * Reusable selector functions
 */
import { upToDate } from './utils';


export const getStateElems = (nameSpace, state) => state[nameSpace];
export const getDidInvalidate = (nameSpace, state) => state[nameSpace].didInvalidate;
export const getUpdateElemId = (nameSpace, state) => state[nameSpace].updateId;
export const getUpdateBusyIds = (nameSpace, state) => state[nameSpace].updateBusyIds;
export const getDeleteBusyIds = (nameSpace, state) => state[nameSpace].deleteBusyIds;
export const getFilterValue = (nameSpace, state) => state[nameSpace].filterValue;
export const getSortKey = (nameSpace, state) => state[nameSpace].sortKey;
export const getSortDirection = (nameSpace, state) => state[nameSpace].sortDirection;
export const getPagination = (nameSpace, state) => state[nameSpace].pagination;
export const getExtraInfo = (nameSpace, state) => state[nameSpace].extraInfo;

/*
 * Return the elements that match the filter value else return all elements.
 */
const getFilteredElems = (elems, filterValue) => {
  let filteredElems = elems.slice();
  if (filterValue !== '') {
    filteredElems = filteredElems.filter((elem) => {
      if (elem.filterString) {
        return elem.filterString.includes(filterValue.toLowerCase());
      }
      return false;
    });
  }
  return filteredElems;
};


const propExists = (obj, sortKeys) => {
  return !!sortKeys.split('__').reduce(
    (ob, sortKey) => {
      if (ob && Object.prototype.hasOwnProperty.call(ob, sortKey)) {
        if (ob[sortKey] === undefined || ob[sortKey] === null) {
          // The property exists, but it has a value of undefined or null
          return true;
        }
        return ob[sortKey];
      }
      return undefined;
    },
    obj,
  );
};

const propValue = (obj, sortKeys) => {
  let value = obj;
  sortKeys.split('__').forEach(
    (sortKey) => {
      value = value[sortKey];
    },
    obj,
  );
  return value;
};


/*
 * If descending or ascending sort required, return sorted elements else just return elems.
 */
const getSortedElems = (elems, sortKey, sortDirection) => {
  let sortedElems = elems.slice();
  if (sortKey !== null && sortDirection !== null) {
    sortedElems = sortedElems.sort((a, b) => {
      const aHasKey = propExists(a, sortKey);
      const bHasKey = propExists(b, sortKey);

      if (!aHasKey || !bHasKey) {
        throw new Error(`Object has no key ${sortKey}`);
      }

      let valA = propValue(a, sortKey); // ignore upper and lowercase
      let valB = propValue(b, sortKey); // ignore upper and lowercase

      if (typeof valA === 'number' && typeof valB === 'number') {
        // Sort integers
        return sortDirection === 'asc' ? (valA - valB) : (valB - valA);
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        // Sort strings
        valA = valA.toUpperCase(); // ignore upper and lowercase
        valB = valB.toUpperCase(); // ignore upper and lowercase
        if (valA < valB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
      } else if (valA === undefined || valA === null) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (valB === undefined || valB === null) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      // case where values are equal
      return 0;
    });
  }
  return sortedElems;
};


export const getElems = (stateElems) => {
  let elems = [];
  if (upToDate(stateElems)) {
    elems = stateElems.elems.slice();

    const { filterValue } = stateElems;
    elems = getFilteredElems(elems, filterValue);

    const { sortKey, sortDirection } = stateElems;
    elems = getSortedElems(elems, sortKey, sortDirection);
  }
  return elems;
};

export const getFetchingComplete = (stateElems) => {
  return upToDate(stateElems);
};

export const getElemToUpdate = (stateElems) => {
  let elemToUpdate = {};
  if (upToDate(stateElems)) {
    const elems = stateElems.elems.slice();
    const { updateId } = stateElems;
    elemToUpdate = elems.find(obj => obj.id === updateId);
  }
  return elemToUpdate || {};
};

export const getTotalElemCount = (stateElems) => {
  return stateElems.elems.length;
};

export const getFilteredElemCount = (stateElems) => {
  const elems = getElems(stateElems);
  return elems.length;
};
