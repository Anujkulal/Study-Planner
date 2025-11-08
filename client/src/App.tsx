import { useState } from "react";
import { Button } from "./components/ui/button"

const App = () => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    console.log("Button clicked!")
  }
  return (
    <div>
      <Button onClick={handleClick}>Click Me</Button>
      {clicked && <p>Button was clicked!</p>}
    </div>
  )
}

export default App