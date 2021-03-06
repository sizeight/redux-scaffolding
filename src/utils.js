/*
 * Return the CSRF token if found in cookies for logged in user, else return undefined.
 *
 * The csrftoken cookie is only applicable for logged in views. For instance, if a form is
 * available on a public view, then the csrftoken will not be available in the browser cookies to
 * send along with the POST request.
 */
export const getCSRFToken = () => {
  let csrftoken;
  if (document.cookie) {
    const found = document.cookie.match(/csrftoken=(.*?)(?:$|;)/);
    if (found) {
      csrftoken = found[1]; /* eslint-disable-line prefer-destructuring */
    }
  }
  return csrftoken;
};

/*
 * Check the status of the fetch response passed and take appropriate action depending on response
 * status.
 */
export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;

  if (error.response.status === 400) {
    // 400 Bad Request
    error.notificationId = '400_BAD_REQUEST';
  } else if (error.response.status === 403) {
    // 403 Forbidden
    error.notificationId = '403_FORBIDDEN';
  } else if (error.response.status === 404) {
    // 404 Not Found
    error.notificationId = '404_NOT_FOUND ';
  } else {
    error.notificationId = `${error.response.status}_UNEXPECTED_RESPONSE`;
  }

  error.errorLogInfo = {
    status: error.response.status, // e.g. 404
    url: error.response.url, // e.g. http://grid.easydata.co.za/api/v1/selections/2409/?detail=l
    msg: error.response.statusText, // e.g. Not Found
  };

  // If the response has a message we attach it as well.
  return error.response.json()
    .then((jsonResponse) => {
      // Django Rest Framework error responses contain a "detail" key in the body.
      // Our error responses contain a "err" key in the body.
      error.errorLogInfo.detail = jsonResponse.detail;
      error.errorLogInfo.jsonResponse = jsonResponse;
      throw error;
    })
    .catch(() => {
      throw error;
    });
};

/*
 * Return the JSON in a fetch response, throw an error if the response is not valid JSON.
 */
export const parseJSON = (response) => {
  return response.json()
    .catch((err) => {
      const error = new Error(response.statusText);
      error.response = response;

      error.notificationId = 'INVALID_JSON_RESPONSE';
      error.errorLogInfo = {
        status: error.response.status,
        url: error.response.url,
        msg: `${err.name}: ${err.message}`,
      };

      throw error;
    });
};

/*
 * Return true if fetching is complete and a valid elems in store.
 */
export function fetchingComplete(obj) {
  return obj && !obj.isFetching && !obj.didInvalidate && obj.lastUpdated !== undefined;
}

/*
 * Return true if valid elems in store
 */
export function upToDate(obj) {
  return obj && !obj.didInvalidate && obj.lastUpdated !== undefined;
}

/* NOT USED YET
 * Return true if busy fetching, but valid elems in store.
 */
/*
export function upToDateButFetching(obj) {
  return obj && obj.isFetching === true && obj.didInvalidate === false
    && obj.lastUpdated !== undefined;
}
*/

/*
 * Return a boolean indicating whether an object has to be fetched.
 */
export function shouldFetch(state, maxAgeInMinutes = 5) {
  // Shorter refetch period of 10 second in development mode
  let maxCacheAgeInMiliseconds = maxAgeInMinutes * 60000; // 5 Minutes
  if (process.env.NODE_ENV !== 'production') {
    maxCacheAgeInMiliseconds = maxAgeInMinutes * 1000; // 10 seconds = 1000 * 10
  }

  if (!state) {
    return true;
  }

  if (state.isFetching) {
    return false;
  }

  if (!state.lastUpdated) {
    return true;
  }

  if (state.lastUpdated <= Date.now() - maxCacheAgeInMiliseconds) {
    return true;
  }

  return state.didInvalidate;
}

/*
 * Fetch API Path, check the status and parse the results.
 */
export function fetchCheckAndParse(apiURL) {
  return fetch(apiURL)
    .then(checkStatus)
    .then(parseJSON);
  /*
    .then(
      (response) => {
        return response;
      },
      (error) => {
        return error;
      },
    );
  */
}
