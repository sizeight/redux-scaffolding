import * as t from './actionTypes';

/*
 * filterOnFields:    Optional, use to specify object fields that reducer should "lowercase concat"
 *                    into one filter string
 * responseElemsKey:  Optional, use to specify if response array is found in a specific response
 *                    object field
 */
export const initialState = {
  isFetching: false,
  didInvalidate: false,
  lastUpdated: undefined,
  elems: [], // array of state objects
  filterOnFields: [], // Optional
  responseElemsKey: undefined, // Optional, compulsory if pagination is used

  updateId: -2, // -1 (none), -1 (new), id (id of object to be updated)
  deleteId: -2, // -2 (none), -1 (all), id (id of object to be deleted)
  filterValue: '',
  sortKey: null,
  sortDirection: null,
  expandId: -2, // -2 (not expanded), -1 (all expanded), id (id of object expanded)

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
      const nextQueryParamsString = action.elems.next ? `${action.elems.next.split('?')[1]}` : null;
      const previousQueryParamsString = action.elems.previous
        ? `${action.elems.previous.split('?')[1]}` : null;
      let pageSize;
      let pageCount;
      let pageNumber = 0;
      let resultPages = [];

      // new
      let query = null;
      let nextQueryParams = null;
      let previousQueryParams = null;

      const urlToAnalyse = action.elems.next || action.elems.previous;
      if (urlToAnalyse) {
        let params;
        let limit;
        let offset;
        if (action.elems.next) {
          const pairs = nextQueryParamsString.split('&');
          nextQueryParams = {};
          pairs.forEach((pair) => {
            const kv = pair.split('=');
            nextQueryParams[kv[0]] = decodeURIComponent(kv[1] || '');
            if (kv[0] === 'limit' || kv[0] === 'offset') {
              nextQueryParams[kv[0]] = Number.parseInt(nextQueryParams[kv[0]], 10);
            }
          });
          limit = Number.parseInt(nextQueryParams.limit, 10);
          offset = Number.parseInt(nextQueryParams.offset, 10);
          pageNumber = (offset - limit) / limit;
          params = { ...nextQueryParams };
        }
        if (action.elems.previous) {
          const pairs = previousQueryParamsString.split('&');
          previousQueryParams = {};
          pairs.forEach((pair) => {
            const kv = pair.split('=');
            previousQueryParams[kv[0]] = decodeURIComponent(kv[1] || '');
            if (kv[0] === 'limit' || kv[0] === 'offset') {
              previousQueryParams[kv[0]] = Number.parseInt(previousQueryParams[kv[0]], 10);
            }
          });
          limit = Number.parseInt(previousQueryParams.limit, 10);
          offset = previousQueryParams.offset ? Number.parseInt(previousQueryParams.offset, 10) : 0;
          pageNumber = (offset + limit) / limit;
          params = { ...previousQueryParams };
        }

        pageSize = limit;
        pageCount = Math.ceil(action.elems.count / pageSize);
        params.offset = params.offset || offset;

        resultPages = [...Array(pageCount).keys()].map((obj, i) => {
          return {
            pageNumber: i,
            active: i === pageNumber,
            queryParamsString: Object.keys(params).map((key, j) => {
              return `${j === 0 ? '?' : ''}${key}=${key === 'offset' ? i * limit : params[key]}`;
            }).join('&'),
            queryParams: {
              ...params,
              limit: Number.parseInt(limit, 10),
              offset: i * limit,
            },
          };
        });

        // Show at most 9 pages with active page in the middle if possible.
        const pagesToLeft = pageNumber;
        const pagesToRight = pageCount - pageNumber;

        const pagesShownToLeft = pagesToRight < 5 ? 9 - pagesToRight : 4;
        const pagesShownToRight = pagesToLeft < 4 ? 9 - pagesToLeft : 5;

        const firstPage = pageNumber - pagesShownToLeft < 0 ? 0 : pageNumber - pagesShownToLeft;
        const lastPage = pageNumber + pagesShownToRight;

        resultPages = resultPages.slice(firstPage, lastPage);

        query = params.q || null;
      }

      return {
        count: action.elems.count,
        next: action.elems.next,
        previous: action.elems.previous,
        queryParams: {
          q: query,
        },
        nextQueryParamsString: nextQueryParamsString ? `?${nextQueryParamsString}` : null,
        nextQueryParams,
        previousQueryParamsString: previousQueryParamsString
          ? `?${previousQueryParamsString}` : null,
        previousQueryParams,
        pageSize,
        pageCount,
        pageNumber,
        pages: resultPages,
      };
    }
    case `${nameSpace}${t.UPDATE_SUCCESS}`:
      // DELETE
      if (action.elem === undefined && state.count > 0) {
        return {
          ...state,
          count: state.count - 1,
        };
      }
      return state;
    default:
      return state;
  }
};

export const elems = (nameSpace, state = initialState, action = {}) => {
  switch (action.type) {
    case `${nameSpace}${t.FETCH_BUSY}`:
      return {
        ...state,
        isFetching: true,
      };
    case `${nameSpace}${t.FETCH_SUCCESS}`: {
      let responseElems = [];
      let responsePagination = initialState.pagination;
      let responseExtraInfo = state.extraInfo;

      if (state.responseElemsKey !== undefined
        && Array.isArray(action.elems[state.responseElemsKey])) {
        // Response is an array inside the response object with potential extra info...
        const keys = Object.getOwnPropertyNames(action.elems);
        keys.forEach((key) => {
          if (key === state.responseElemsKey) {
            responseElems = action.elems[key].slice();
          } else {
            responseExtraInfo = {
              ...responseExtraInfo,
              [key]: action.elems[key],
            };
          }
        });

        // ...and potential pagination
        // Store pagination info only if pagination keys are in response
        if (keys.findIndex((x) => x === 'count') > -1 && keys.findIndex((x) => x === 'next') > -1
          && keys.findIndex((x) => x === 'previous') > -1) {
          responsePagination = pagination(nameSpace, state.pagination, action);
        }
      } else if (Array.isArray(action.elems)) {
        // Response is an array of objects
        responseElems = action.elems.slice();
      } else {
        // Response is an individual object
        responseElems = [action.elems];
      }

      const newElems = responseElems.map((elem) => {
        return {
          ...elem,
          filterString: getFilterString(state.filterOnFields, elem),
        };
      });

      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: Date.now(),
        elems: action.append === true ? [
          ...state.elems,
          ...newElems,
        ] : newElems,
        pagination: responsePagination,
        extraInfo: responseExtraInfo,
      };
    }
    case `${nameSpace}${t.FETCH_FAILURE}`:
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
      };

    case `${nameSpace}${t.RESET_STATE}`:
      return initialState;

    case `${nameSpace}${t.SET_UPDATE_ID}`: {
      return {
        ...state,
        updateId: action.id,
      };
    }
    case `${nameSpace}${t.UPDATE_SUCCESS}`: {
      // CREATE
      if (action.id === -1) {
        return {
          ...state,
          elems: [
            {
              ...action.elem,
              filterString: getFilterString(state.filterOnFields, action.elem),
            },
            ...state.elems,
          ],
        };
      }
      const idx = state.elems.findIndex((obj) => obj.id === action.id);
      // DELETE
      if (action.elem === undefined) {
        return {
          ...state,
          elems: [
            ...state.elems.slice(0, idx),
            ...state.elems.slice(idx + 1),
          ],
          pagination: pagination(nameSpace, state.pagination, action),
        };
      }
      // UPDATE
      return {
        ...state,
        elems: [
          ...state.elems.slice(0, idx),
          {
            ...action.elem,
            filterString: getFilterString(state.filterOnFields, action.elem),
          },
          ...state.elems.slice(idx + 1),
        ],
      };
    }

    case `${nameSpace}${t.SET_UPDATE_BUSY_ID}`: {
      const idx = state.updateBusyIds.findIndex((x) => x === action.id);

      return {
        ...state,
        updateBusyIds: action.busy ? [
          ...state.updateBusyIds,
          action.id,
        ] : [
          ...state.updateBusyIds.slice(0, idx),
          ...state.updateBusyIds.slice(idx + 1),
        ],
      };
    }

    case `${nameSpace}${t.SET_DELETE_ID}`: {
      return {
        ...state,
        deleteId: action.id,
      };
    }
    case `${nameSpace}${t.SET_DELETE_BUSY_ID}`: {
      const idx = state.deleteBusyIds.findIndex((x) => x === action.id);

      return {
        ...state,
        deleteBusyIds: action.busy ? [
          ...state.deleteBusyIds,
          action.id,
        ] : [
          ...state.deleteBusyIds.slice(0, idx),
          ...state.deleteBusyIds.slice(idx + 1),
        ],
      };
    }

    case `${nameSpace}${t.SET_FILTER_VALUE}`: {
      return {
        ...state,
        filterValue: action.value,
      };
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

      return {
        ...state,
        sortKey: newSortKey,
        sortDirection: newSortDirection,
      };
    }

    case `${nameSpace}${t.SET_EXPAND_ID}`: {
      let newExpandId = action.expandId;
      if (state.expandId === newExpandId) {
        newExpandId = -2;
      }

      return {
        ...state,
        expandId: newExpandId,
      };
    }

    default:
      return state;
  }
};
