export default function checkMinMaxExists(arr, minProp, maxProp) {
  let minExists = false;
  let maxExists = false;

  if (arr) {
    for (const obj of arr) {
      if (obj.name === minProp) {
        minExists = true;
      } else if (obj.name === maxProp) {
        maxExists = true;
      }
    }
  }

  return minExists && maxExists;
}
