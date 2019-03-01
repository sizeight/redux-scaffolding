# reducer

Reusable Redux reducer for an array of objects.

## Usage example

Specify filterOnFields in initial state, the reducer will then create a `filterString` field for each elem by concatenating the lowercase string of each field specified.

e.g. Let's say an element has fields `title: 'Alpha` and `subTitle: Beta` then a new field will be created `filterString: 'alpha beta'` to be used for filtering.

The example also inicates how to add aditional custom actions.

```javascript
// src/state/pages/reducer.js

import { reducer } from 'redux-scaffolding';

const { initialState, elems } = reducer;

/*
initialState = {
  isFetching: false,
  didInvalidate: false,
  lastUpdated: undefined,
  elems: [], 
  filterOnFields: [], // Override this as below with relevant filter fields

  updateId: -1, // id for which to show update form
  filterValue: '',
  sortKey: null,
  sortDirection: null,

  pagination: {}, // If pagination is relevant
};

If pagination is used then the pagination field will be populated as follows:
e.g.
  pagination: {
    count: 3, // Number of pages
    page_size: 10, // Number of elements on page
    page: 2, // Active page
    next: 3, // Next page number
    previous: 1, // Previous page number,
  }  
*/

const nameSpace = 'pages'; // IMPORTANT: The state key

// Example of including more state
const initialWebsitesState = Object.assign({}, initialState, {
  filterOnFields: ['title', 'subtitle'], // Fields to filter on
  extra1: 'extra state 1',
  extra1: 'extra state 2',
});

const pages = (state = initialWebsitesState, action) => {
  switch (action.type) {
    case 'website/CUSTOM_ACTION':
      // Example of a custom action
      return state;
    default:
      return elems(nameSpace, state, action);
  }
};

export default pages;

```
