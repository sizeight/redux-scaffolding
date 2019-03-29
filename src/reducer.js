import * as t from './actionTypes';

export const initialState = {
  isFetching: false,
  didInvalidate: false,
  lastUpdated: undefined,
  elems: [], // array of state objects
  filterOnFields: [], // Optional, use to specify object fields that reducer should "lowercase concat" into one filter string
  responseElemsKey: undefined, // Optional, use to specify if response array is in specific response object field

  updateId: -1, // id for which to show update form
  filterValue: '',
  sortKey: null,
  sortDirection: null,

  pagination: {}, // If paginated response, pagination info will be stored here
  extraInfo: {}, // If responseElemsKey is specified, any extra response fields will be stored here

  updateBusyIds: [], // These elemId's are busy being updated
  deleteBusyIds: [], // These elemId's are busy being deleted
};

function getFilterString(filterOnFields, elem) {
  return filterOnFields.map((filterKey) => {
    const hasKey = Object.prototype.hasOwnProperty.call(elem, filterKey);
    if (!hasKey) {
      throw new Error(`Object has no key '${filterKey}'`);
    }

    return elem[filterKey].toLowerCase();
  }).join(' ');
}

const pagination = (nameSpace, state, action) => {
  switch (action.type) {
    case `${nameSpace}${t.FETCH_SUCCESS}`: {
      return {
        count: action.elems.count,
        page_size: action.elems.page_size,
        page: action.elems.page,
        next: action.elems.next,
        previous: action.elems.previous,
      };
    }
    case `${nameSpace}${t.UPDATE_SUCCESS}`:
      // DELETE
      if (action.elem === undefined && state.count > 0) {
        return Object.assign({}, state, {
          count: state.count - 1,
        });
      }
      return state;
    default:
      return state;
  }
};

export const elems = (nameSpace, state = initialState, action) => {
  switch (action.type) {
    case `${nameSpace}${t.FETCH_BUSY}`:
      return Object.assign({}, state, {
        ...state,
        isFetching: true,
      });
    case `${nameSpace}${t.FETCH_SUCCESS}`: {
      let responseElems = [];
      let responsePagination = initialState.pagination;
      let responseExtraInfo = state.extraInfo;

      if (state.responseElemsKey !== undefined
        && Array.isArray(action.elems[state.responseElemsKey])) {
        // Response is an array inside the response object with potential extra info
        const keys = Object.getOwnPropertyNames(action.elems);
        keys.forEach((key) => {
          if (key === state.responseElemsKey) {
            responseElems = action.elems[key].slice();
          } else {
            responseExtraInfo = Object.assign({}, responseExtraInfo, {
              [key]: action.elems[key],
            });
          }
        });
      } else if (Array.isArray(action.elems)) {
        // Response is an array of objects
        responseElems = action.elems.slice();
      } else if (action.elems.results) {
        // Response is paginated
        responseElems = action.elems.results.slice();
        responsePagination = pagination(nameSpace, state.pagination, action);
      } else {
        // Response is an individual object
        responseElems = [action.elems];
      }

      const newElems = responseElems.map((elem) => {
        return Object.assign({}, elem, {
          filterString: getFilterString(state.filterOnFields, elem),
        });
      });

      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: action.append === true ? [
          ...state.elems,
          ...newElems,
        ] : newElems,
        pagination: responsePagination,
        extraInfo: responseExtraInfo,
      });
    }
    case `${nameSpace}${t.FETCH_FAILURE}`:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: true,
      });

    case `${nameSpace}${t.SET_UPDATE_ID}`: {
      return Object.assign({}, state, {
        ...state,
        updateId: action.id,
      });
    }
    case `${nameSpace}${t.UPDATE_SUCCESS}`: {
      // CREATE
      if (action.id === -1) {
        return Object.assign({}, state, {
          elems: [
            Object.assign({}, action.elem, {
              filterString: getFilterString(state.filterOnFields, action.elem),
            }),
            ...state.elems,
          ],
        });
      }
      const idx = state.elems.findIndex(obj => obj.id === action.id);
      // DELETE
      if (action.elem === undefined) {
        return Object.assign({}, state, {
          elems: [
            ...state.elems.slice(0, idx),
            ...state.elems.slice(idx + 1),
          ],
          pagination: pagination(nameSpace, state.pagination, action),
        });
      }
      // UPDATE
      return Object.assign({}, state, {
        elems: [
          ...state.elems.slice(0, idx),
          Object.assign({}, action.elem, {
            filterString: getFilterString(state.filterOnFields, action.elem),
          }),
          ...state.elems.slice(idx + 1),
        ],
      });
    }

    case `${nameSpace}${t.SET_UPDATE_BUSY_ID}`: {
      const idx = state.updateBusyIds.findIndex(x => x === action.id);

      return Object.assign({}, state, {
        ...state,
        updateBusyIds: action.busy ? [
          ...state.updateBusyIds,
          action.id,
        ] : [
          ...state.updateBusyIds.slice(0, idx),
          ...state.updateBusyIds.slice(idx + 1),
        ],
      });
    }
    case `${nameSpace}${t.SET_DELETE_BUSY_ID}`: {
      const idx = state.deleteBusyIds.findIndex(x => x === action.id);

      return Object.assign({}, state, {
        ...state,
        deleteBusyIds: action.busy ? [
          ...state.deleteBusyIds,
          action.id,
        ] : [
          ...state.deleteBusyIds.slice(0, idx),
          ...state.deleteBusyIds.slice(idx + 1),
        ],
      });
    }

    case `${nameSpace}${t.SET_FILTER_VALUE}`: {
      return Object.assign({}, state, {
        ...state,
        filterValue: action.value,
      });
    }

    case `${nameSpace}${t.SET_SORT_KEY}`: {
      let newSortKey = action.sortKey;
      let newSortDirection = 'asc';
      if (state.sortKey === action.sortKey) {
        if (!state.sortDirection) {
          newSortKey = action.sortKey;
          newSortDirection = 'asc';
        } else if (state.sortDirection === 'asc') {
          newSortKey = action.sortKey;
          newSortDirection = 'desc';
        } else if (state.sortDirection === 'desc') {
          newSortKey = null;
          newSortDirection = null;
        }
      }

      return Object.assign({}, state, {
        ...state,
        sortKey: newSortKey,
        sortDirection: newSortDirection,
      });
    }
    default:
      return state;
  }
};
