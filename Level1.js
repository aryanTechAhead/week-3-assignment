// Task 1
/*
Rewrite 3 regular functions as arrow functions
Each should work identically to the original
*/

function add(a, b) {
  return a + b;
}

console.log(add(5, 4));

async function fetchdata(url) {
  try {
    //Pehle the function was handled twice becuase pehle wo fetch kr ke ek variable m store kr rha the but now directly hi using await(await fetch(url)).json() ka use krke kaam ho gya.
    let respone = await fetch(url);
     if (!respone.ok) {
      throw new Error(`HTTP error: ${respone.status}`);
    }
    const res= await respone.json()
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

fetchdata("https://jsonplaceholder.typicode.com/todos/1");

function tellTheTask1isDone(name) {
  console.log(` Hey ${name}, This task is completed by Aryan Bhutani`);
}
tellTheTask1isDone("User");


// The above Functions can be used through arrow functions as 

let addArrow= (a, b)=> a + b

// Agar merko sirf ek hi output dena hota h to wo m bina { return } ke bina bhi directly de skta hu
console.log(addArrow(10,16))

let fetchdataArrow=async url=> {

    // Agar sirf ek hi parameter hota h to directly bina () ke use kr skte h arrow function
    try {
    const respone = await fetch(url)
    const res= await respone.json()
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

fetchdataArrow("https://jsonplaceholder.typicode.com/todos/1")


// Task 2
// Destructure a nested object with default values Access 3+ Levels Deep with Fallbacks


const user = {
  id: 101,
  profile: {
    name: "Aryan",
    address: {
      city: "Delhi"
    }
  }
};


// Destructuring Normally when the data inside is know to us 

const{
    profile:{
        name,
        Username='Name from Nested Object'
        ,address:{
            city="NOIDA",
            country="India"
        }={}
    }={}
}=user
console.log(name)

// Optional Chaining when the data is not known to us by using the ?. operator
//Agar hme nhi pta h ki object m koi cheez exist krti h ya nhi to direct . se access krte h but the issue is ki sometimes wo undefined return kr skta h jiske liye hm optional chaining use krte h which is like ki agr wo object ka wo key mil gya to thik wrna wo undefined show krke jo optional value hoti h usko dikha deta h .... optional value is given through ??

// Gives Error becuase m us object ki value (Father) ko access krna chah rha hu jo exist hi nhi Krta agr m sirf user?.profile?.ParentNameOptional krta to koi dikkt nhi aati bs Parent Name not present aajata 
const ParentNameOptional= user?.profile?.ParentNameOptional?.Father??"Parent Name not present in the obj"
console.log(ParentNameOptional)
const cityOPtional= user?.profile?.address?.city??"Faridabad"
console.log(cityOPtional)


// Task 3
// Merge two arrays without duplicates using spread + Set new Set([...a, ...b]) — convert back to array

const frontendSkills = [
  "HTML",
  "CSS",
  "JavaScript"
];

const backendSkills = [
  "Node.js",
  "JavaScript",
  "MongoDB"
];
// Without Set
const skills=[...frontendSkills,...backendSkills]
console.log(skills)

// With Set
const uniqueSkills=new Set([...frontendSkills,...backendSkills])
console.log(uniqueSkills)


// function highlight(strings, ...values) {
//   return strings.reduce((result, str, index) => {
//     const value =
//       values[index] !== undefined
//         ? `[${String(values[index]).toUpperCase()}]`
//         : "";

//     return result + str + value;
//   }, "");
// }


/*
  Task 3:
  Write a tagged template that uppercases all interpolated values
  highlight`Hello ${name}` → 'Hello [ARUN]'

*/


function highlight(strings, ...values) {
  let result = "";

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];

    if (i < values.length) {
      result += `[${String(values[i]).toUpperCase()}]`;
    }
  }

  return result;
}

const hname = "Arun";
const hrole = "SDE-1";

const message =
  highlight`${hname} is working as ${hrole}`;

console.log(message);