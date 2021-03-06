# selectors

Reusable selectors for an array of objects.

- Important to use memoized createSelector for setting up selectors that perform calculations.

## Usage example

```javascript
// src/state/pages/selectors.js

import { createSelector } from 'reselect';

import { selectors } from 'redux-scaffolding';

const {
  getStateElems, getFetchingComplete, getElems, getElemToUpdate, getFilterValue,
  getTotalElemCount, getFilteredElemCount, getSortKey, getSortDirection,
} = selectors;


const nameSpace = 'pages'; // IMPORTANT: The state key

const getStatePages = state => getStateElems(nameSpace, state); // Pass this state into the selector functions below
export const getPageFilterValue = state => getFilterValue(nameSpace, state);
export const getPageSortKey = state = getSortKey(nameSpace, state);
export getPageSortDirection = state => getSortDirection(nameSpace, state);

export const getFetchingPagesComplete = createSelector(
  [getStatePages],
  (statePages) => {
    return getFetchingComplete(statePages);
  },
);

export const getPages = createSelector(
  [getStatePages],
  (statePages) => {
    return getElems(statePages);
  },
);

export const getTotalPageCount = createSelector(
  [getStatePages],
  (statePages) => {
    return getTotalElemCount(statePages);
  },
);

export const getFilteredPageCount = createSelector(
  [getStatePages],
  (statePages) => {
    return getFilteredElemCount(statePages);
  },
);

export const getPageToUpdate = createSelector(
  [getStatePages],
  (statePages) => {
    return getElemToUpdate(statePages);
  },
);

// CUSTOM SELECTORS
// Add any custom selectors here...

```

## Reference

### getStateElems(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Object: Returns an object with the state object.

### getUpdateElemId(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Number: Returns the id of element being updated.

### getFilterValue(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
String: Return the string to filter elements by, e.g. 'blue' or 'dogs' or 'laptos'

### getSortKey(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
String: Return the key to sort by, e.g. 'title'

### getSortDirection(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
String: Returns `null`, `asc`, od `desc`

### getPagination(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Object: Returns an object with the pagination state object

### getExtraInfo(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Object: Returns an object with the extraInfo state object

### getUpdateBusyIds(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Object: Returns an array with id's of objects being updated

### getDeleteBusyIds(nameSpace, state)
#### Arguments
  * nameSpace: The name of the state object
  * state: The Redux state
#### Returns
Object: Returns an object with id's of objects being deleted
