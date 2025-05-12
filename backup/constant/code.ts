export const constants = `export const π = 3.141_59;\nexport const e = 2.718_28;\nexport const φ = 1.618_03;\nexport const λ = 1.303_57;`;
export const index =
  "// DYNAMIC NAMESPACES\n// In some cases, you don't know which exports will\n// be accessed until you actually run the code. In\n// these cases, Rollup creates a namespace object\n// for dynamic lookup\nimport * as constants from './constants';\n\nfor (const key of Object.keys(constants)) {\n\tconsole.log(`The value of ${key} is ${constants[key]}`);\n};\nconst div = document.createElement('div');div.textContent = 'Hello, world!';document.body.appendChild(div);";

export const jsx = `
  import {useState} from 'react';
  import {createRoot} from 'react-dom/client';
  function App(){
    const [counter,setCounter] = useState(0);
    return <button onClick={()=>setCounter(counter+1)}>{counter}</button>;
  }
  createRoot(Object.assign(document.createElement('div'), {id:'roor'})).render(App)
`;
