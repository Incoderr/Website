import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
        <footer>
          <div className="container">
              <Link to={"/register"}>hi</Link>
          </div>                                      
        </footer>
    </div>
  );
}
export default Home;
