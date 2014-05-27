//Common Javascript to be included on every page.

/**
 * Format a number to add commas in the thousands.
 * @param nStr number or string to be formatted. (10000.001)
 * @return formatted string (10,000.001)
 */
function addCommas(nStr){
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

/**
 * Trim whitespace from a string.
 * @param str string to be trimmed. ('   example ')
 * @return string ('example')
 */
function trim(str) {
  if (str){
    return str.replace(/^\s+|\s+$/g,"");
  }else{
    return "";
  }
}

/**
 * Uppercase the first character in a string.
 * @param str string ('example')
 * @return string ('Example')
 */
function ucfirst(str) {
  return str.substr(0,1).toUpperCase() + str.substr(1,str.length);
}

/**
 * Uppercase the first letter of each word in a string.
 * @param str string ('example multi-word string')
 * @return string ('Example Multi-word String')
 */
function ucwords(str) {
  return (str + '').replace(/^(.)|\s(.)/g, function ($1) {
    return $1.toUpperCase();
  });
}

/**
 * Uppercase the first letter of each word in a string after replacing _s with spaces
 * Opposite of keyify()
 * @param str string ('typical_key_name')
 * @return string ('Typical Key Name')
 */
function formatKey(str) {
  str = str.replace(/_/g, ' ');
  return ucwords(str);
}

/**
 * Returns a standard db key by converting a string to lower case with _s instead of spaces and removing special characters.
 * Opposite of formatKey()
 * @param str string ('  Typical Key Name!!*^&     ')
 * @return string ('typical_key_name')
 */
function keyify(str) {
  str = str.replace(/[^a-zA-Z0-9_ -]/g, '');
  str = trim(str);
  str = str.replace(/\s/g, '_');
  return str.toLowerCase();
}

/**
 * Checks to see if mixed needle exists in array haystack.
 * (Duplicates PHPs in_array function)
 * @param needle mixed
 * @param haystack array
 * @param argStrict boolean compare types
 * @return boolean
 */
function in_array(needle, haystack, argStrict) {
  var key = '', strict = !!argStrict; 
  if (strict){
    for (key in haystack){
      if (haystack[key] === needle){
        return true;            
      }
    }
  }else{
    for (key in haystack){
      if (haystack[key] == needle){
        return true;
      }
    }
  }
  return false;
}


/**
 * Returns all states as a json string with 2 letter abreviation as the object property and full name as the value.
 * @return json object
 */
function getStatesAsJson(){
  var json = {AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
    IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MT: 'Montana', MS: 'Mississippi', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah',
    VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'};
  return json;
}

/**
 * Checks to see if the passed value is a float or not.  Considers strings and numbers.
 * @param val anything
 * @return boolean 
 */
function isFloat(val){
  if (!val) {
    return false;
  }
  val += '';
  if (isNumeric(val)){
    if (val.indexOf('.') != -1){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

/**
 * Checks to see if the passed value is a number or not.  Considers strings and numbers.
 * @param val anything
 * @returns boolean
 */
function isNumeric(val){
  return !isNaN(new Number(val));
}


/**
 * Determine the mathematical sign of a value and return as +/- 1
 * May someday be replaced by Math.sign(), currently proposed in next javascript base
 * @param val Number
 * @returns 0, -1, or 1
 */
function signum(val){
  if (!val || !isNumeric(val)){
    return 0;
  }
  return (val < 0)? -1 : 1;
}


/**
 * Returns the human-readable version of a filesize in bytes
 * Example: var size = getHumanReadableFileSize(3984628); //3.8 MB
 * @param {Integer} n
 * @returns {String} human-readable filesize
 */
function getHumanReadableFileSize(n){
  if (!isNumeric(n)){
    return n;
  }
  var i = -1;
  var byteUnits = ['kB','MB','GB','TB','PB'];
  do {
    n = n / 1024;
    i++;
  } while (n > 1024);
  return n.toFixed(2) + ' ' + byteUnits[i];
}


/**
 * Returns a 10 digit US phone number formatted for display, American-style
 * @param {Integer} n
 * @returns {String} human-readable phone number
 */
function formatPhoneNumberForDisplay(n){
  n = ''+n;
  return '('+n.slice(0,3)+') '+n.slice(3,6)+'-'+n.slice(6);
}

/**
 * Returns a unique id generated from the current timestamp
 * @returns int uniqueId
 */
function uniqueId(){
  var newDate = new Date;
  return newDate.getTime();
}

/**
 * Browser object with browser type determinations and convenience methods
 * Usage: if (browser.isIE){ do something.. }
 *        if (!browser.hasNativeDatepicker()){ $(input).datepicker().. }
 */
var browser = {
  isIE: navigator.userAgent.indexOf('MSIE') !== -1,
  isIE8: navigator.userAgent.indexOf('MSIE 8') !== -1,
  isIE9: navigator.userAgent.indexOf('MSIE 9') !== -1,
  isIE10: navigator.userAgent.indexOf('MSIE 10') !== -1,
  isSafari: navigator.vendor != undefined && navigator.vendor.indexOf("Apple") !== -1,
  isChrome: navigator.vendor != undefined && navigator.vendor.indexOf('Google') !== -1,
  isFirefox: navigator.userAgent.indexOf('Mozilla') !== -1 && navigator.vendor != undefined && navigator.vendor.length === 0,
  hasNativeDatepicker: function(){
    return (this.isChrome);
  }
};

/**
 * Chrome no longer allows date fields to be set by js in any format other that yyyy-mm-dd, which
 * is unusual since it defaults to display them in mm/dd/yyyy, at least for us-en locale.
 * This function accepts any date string and formats it the way Chrome is expecting.
 * @param dateStr
 * @returns dateStr (formatted for Chrome)
 */
function getChromeDate(dateStr){
  if (!isValidDate(dateStr)){
    return '';
  }
  var dateObj = new Date(dateStr);
  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var date = dateObj.getDate();
  //Pad months and days (unfortunately necessary, as Chrome will reject single digit months and days)
  if (month < 10){
    month = '0' + month;
  }
  if (date < 10){
    date = '0' + date;
  }
  var chromeDate = year + '-' + month + '-' + date;
  return chromeDate;
}

/**
 * Check to see if a dateString is a valid date
 * @param d (date string or obj)
 * @returns boolean
 */
function isValidDate(d) {
  if (!(d instanceof Date)){
    d = new Date(d);
  }
  return !isNaN(d.getTime());
}
