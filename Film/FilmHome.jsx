import React from "react";

import { Link } from "react-router-dom";
/*кампоненты*/
import HeaderEl from "../src/components/HeaderEl";
import FooterEl from "../src/components/FooterEl";

/*свайпер*/

function Home() {
  return (
    <div>
      <HeaderEl />
      <main className="">
        фильм
      </main>
      <FooterEl />
    </div>
  );
}
export default Home;
