

// Task 1: Given an array of numbers, return only primes using filter()
// [2, 3, 4, 5, 6, 7] → [2, 3, 5, 7]

// For Prime Number: Divisibility Check: Check if n is divisible by any integer from 2 up to the square root of n, i.e., sqrt{n}).
const arr = [2, 3, 4, 5, 6, 7];
const PrimeArr = arr.filter((val) => {
  if (val <= 1) return false;
  for (let i = 2; i <= Math.sqrt(val); i++) {
    if (val % i === 0) return false;
  }
  return true;
});

console.log(PrimeArr);

// Task 2:
// Use reduce() to count how many times each word appears in an array
// ['a','b','a'] → { a: 2, b: 1 }

const words = ["a", "b", "a", "a", "b", "a"];
const countWords = words.reduce((Accumulator, val) => {
  // Using if Else statements
  if (Accumulator[val]) {
    Accumulator[val] = Accumulator[val] + 1;
  } else {
    Accumulator[val] = 1;
  }

  // Using straight the logic i.e. accumulator[currentValue] || 0: Checks if the word is already a key in the object. If it is not found (undefined), it defaults to 0 and+ 1: Increments the count for that word.

  // Accumulator[val]=(Accumulator[val]||0)+1
  return Accumulator;
}, {});

console.log(countWords);



// Task 3: Chain filter + map + reduce: total price of in-stock items only
const products = [
  { name: "Laptop", price: 75000, inStock: true },
  { name: "Phone", price: 30000, inStock: false },
  { name: "Tablet", price: 45000, inStock: true },
  { name: "Monitor", price: 20000, inStock: true },
  { name: "Keyboard", price: 5000, inStock: false },
];

// const filteredproduct = products
//   .filter((products) => {
//     if (products.inStock) return true;
//   })
//   .map((products) => {
//     return products.price;
//   })
//   .reduce((Accumulator, val) => {
//     return Accumulator + val;
//   }, 0);

const filteredproduct = products 
  .filter(product => product.inStock)           
  .map(product => product.price)                 
  .reduce((total, price) => total + price, 0);   


console.log(filteredproduct);


// Task 4: Use find() and some() on a user list from the API
// Find user with id 3; check if any user is from 'Gwenborough'

const task4function= async ()=>{
   try {
     const responseFromAPI= await fetch('https://jsonplaceholder.typicode.com/users')
     if (!responseFromAPI.ok) {
      throw new Error(`HTTP error: ${responseFromAPI.status}`);
    }
     const res= await responseFromAPI.json()
    console.log(res)
    // Find user with id 3;
    const id3= res.find((user)=>{
       if(user.id== 9) return true
    })
    console.log(id3)
    const Gwenborough = res.some((elem)=>{
        if(elem?.address?.city==="Gwenborough") return true
    })

    console.log(Gwenborough)

    // To find which user has the city 
    const practice= res.find((userdata)=>{
        if(userdata?.address?.city==="Gwenborough") return true
    })
    console.log(practice)
   
} catch (error) {
    console.log(error)
   }
}

task4function()