
let resStatus = false;

function isResEnded() {
  if (!resStatus) {
    resStatus = true;
    return false; // Indicate that res.end has not been used before
  } else {
    return true; // Indicate that res.end has been used before
  }
}

function reset(){
    resStatus = false
}
module.exports = {
  isResEnded, reset
};