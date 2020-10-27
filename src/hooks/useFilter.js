import { useMemo } from 'react';

function useFilter(objArr, fields, filterValue) {
  const filteredArr = useMemo(
    () => {
      function getFilterString(filterOnFields, elem) {
        return filterOnFields.map((filterKey) => {
          const arr = filterKey.split('__');
          let tmp = { ...elem };
          let value = '';
          arr.forEach((key, i) => {
            // Does key exist?
            const hasKey = Object.prototype.hasOwnProperty.call(tmp, key);
            if (!hasKey) {
              throw new Error(`Object has no key '${filterKey}'`);
            }
            if (Object.is(arr.length - 1, i)) {
              // execute last item logic
              value = tmp[key];
            }
            tmp = { ...tmp[key] };
          });
          return value.toLowerCase();

          // TODO: Numbers and dates should be filterable. Test her for type and return as string
          // return value.toString(10).toLowerCase();
        }).join(' ');
      }

      let filteredElems = objArr.slice();
      if (filterValue !== '') {
        filteredElems = objArr.filter((obj) => {
          const filterString = getFilterString(fields, obj);
          return filterString.includes(filterValue.toLowerCase());
        });
      }
      return filteredElems;
    },
    [objArr, fields, filterValue],
  );

  return filteredArr;
}

export default useFilter;
