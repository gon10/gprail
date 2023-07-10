import moment from 'moment'

export function escape(str) {
  return str
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};

export function formatValidDate(date) {
  const formats = [
    "YYYY-MM-DD[T]HH:mm",
    "YYYY-MM-DD[T]HH:mm:ss.SSS",
    "YYYY-MM-DD[T]HH:mm:ss",
    "YYYY-MM-DD HH:mm:ss",
    "YYYY-MM-DD"
  ];
  if (moment(date, formats, true).isValid()) {
    return moment(date).format();
  } else {
    return false;
  }
}

export function formatDate(value) {
  if (value && moment(value, moment.ISO_8601, true).isValid()) {
    const thisDate = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(new Date(value))
    return thisDate
  } else {
    return value
  }
}

export function eachRecursive(obj) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      eachRecursive(obj[k]);
    } else {
      obj[k] = formatValidDate(obj[k]) ? formatValidDate(obj[k]) : obj[k]
    }
  }
}

export function eachRecursiveInput(obj) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      eachRecursiveInput(obj[k]);
    } else {

      if (moment(obj[k], "YYYY-MM-DD[T]HH:mm:ss+HH:mm", true).isValid()) {
        if (obj[k]) {
          const d = new Date(obj[k]);
          obj[k] = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
          //console.log(obj[k])
        }

      }
    }
  }
}

export function getPropertyByString(obj, propString) {
  if (!propString)
    return obj;

  var prop, props = propString.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

export function traverseObject(obj, destination) {
  if (destination) {
    let destinationArray = destination.split(".")
    let objCopy = obj;
    destinationArray.forEach((step) => {
      if (objCopy) {
        objCopy = objCopy[step]
      } 
    })
    return objCopy
  }
}