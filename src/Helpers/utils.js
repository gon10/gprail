export default function getPropertyByPath(object, path) {
    const pathArray = path.split(/\.|\[|\]/).filter(Boolean);
    let property = object;
    let parentProperty = null;
    let propertyName = null;

  
    for (let i = 0; i < pathArray.length; i++) {
      propertyName = pathArray[i];
      const isArrayIndex = /^\d+$/.test(propertyName);
  
      if ((isArrayIndex && Array.isArray(property)) || (!isArrayIndex && property.hasOwnProperty(propertyName))) {
        parentProperty = property;
        property = property[propertyName];
      } else {
        return undefined;
      }

    }
    const result = { value: property };
    result.remove = function() {
      if (Array.isArray(parentProperty)) {
        parentProperty.splice(propertyName, 1);
      } else {
        delete parentProperty[propertyName];
      }
    };
    result.parent = parentProperty;
    return result;
  }

  export function changeValueByPath(obj, path, value) {
    const pathArray = path.split(/\.|\[|\]/).filter((key) => key !== ''); // Convert path string to array
    let currentObj = obj;
  
    for (let i = 0; i < pathArray.length - 1; i++) {
      // Traverse the object until the second to last property
      if (typeof currentObj[pathArray[i]] === 'undefined') {
        // Create the property if it is undefined
        currentObj[pathArray[i]] = {};
      }

      currentObj = currentObj[pathArray[i]];
    }
  
    currentObj[pathArray[pathArray.length - 1]] = value; // Set the value of the last property
  }

  export function clearObject(obj) {
    
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj[key] instanceof Object) {
        newObj[key] = clearObject(obj[key]);
      } else {
        newObj[key] = '';
      }
    }
    return newObj;
  }

  export function makeSource(file) {
    if (file) {
      const src = `${process.env.REACT_APP_BASE_URL}/api/railhub/attachment/${file.attachmentId}.${(file.attachmentType === "image/png") ? "png" : "jpg" }`
      return src
    }

    return ''
  }