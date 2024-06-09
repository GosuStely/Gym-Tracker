const url = "http://localhost:3000/templates";

// const promise = fetch(url).then( async res => console.log(await res.json()));
const data = await fetch(url);
console.log(await data.json())