import React, {useState, useEffect} from "react";
import Status from "./components/Status.jsx";
import Products from "./components/Products.jsx";
function App() {
  return (
    <div className="App">
      <div className="text-5xl font-bold text-blue-500 w-full text-center mt-10">
         Docker Tutorial
      </div>
      <Status />
      <Products />
    </div>
  );
}

export default App;
