window.calculator = new CalcController();

let array1 = [3,5,2,1];
let array2 = [4,6,3,5];
array2.pop();
array2.pop();
let arraytotal = array1.concat(array2).sort();

console.log("Array total é: ", arraytotal );