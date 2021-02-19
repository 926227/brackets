module.exports = function check(str, bracketsConfig) {

  if (!Array.isArray(bracketsConfig)) {
    return false;
  }
  if (!str || bracketsConfig.length === 0) {
    return false;
  }
  /* Check all keys are Arrays of pairs, no less, no more. */
  for (let i = 0; i < bracketsConfig.length; i++) {
    if (!Array.isArray(bracketsConfig[i]) || bracketsConfig[i].length != 2) {
      return false;
    }
  }

  /***********************************************/
  let closeKeyToggler = {};
  let closeKeys = Object.fromEntries(bracketsConfig.map(function (item) {
    if (item[0] === item[1]) {
      closeKeyToggler[item[1]] = false;
      return [item[1], 'same'];
    } else {
      return [item[1], 'different'];
    }
  }));
  let allKeys = Object.fromEntries(bracketsConfig);
  /* Init stack.*/
  let stack = [];

  /* Check if first bracket close or open type and 'same' or 'different' type.
  Starting with close type bracket will  return 'false' immediatly*/
  if (closeKeys[str[0]] === 'different') {
    return false;
  } else if (closeKeys[str[0]] === 'same') {
    stack = Array(str[0]);
    closeKeyToggler[str[0]] = true;
  } else {
    stack = Array(str[0]);
  }

  /*The main loop  */
  for (let i = 1; i < str.length; i++) {
    /*"closeKeyToggler[str[i]] === true)" means that this 'same type' bracket was opened and now expecting 'clode' type one*/
    if (closeKeys[str[i]] === 'different' ||
      (closeKeys[str[i]] === 'same' && closeKeyToggler[str[i]] === true) 
    ) { 
      let stackLastItemIndex = stack.length - 1;
      if (0 <= stackLastItemIndex && allKeys[stack[stackLastItemIndex]] === str[i]) { /* Check open/close pair */
        stack.pop(); /* If we have valid open/close pair */
        closeKeyToggler[str[i]] = false;
        continue;
      } else {
        return false; /* If 'close type' bracket whithout valid open/close pair return 'false' */
      }
    }

    /* If this single type braclet has not been opened before, then mark it as 'open type' */
    if (closeKeys[str[i]] === 'same' && closeKeyToggler[str[i]] === false) {
      closeKeyToggler[str[i]] = true;
    }

    stack.push(str[i]);
  }

  /* At the end the 'stack' should be empty - if all pairs valid */
  if (stack.length === 0) {
    return true;
  } else {
    return false;
  }
};
