import React from "react";
import { Link } from "react-router-dom";
import HeaderEl from "../components/HeaderEl.jsx";


const NotFound = () => {
  return (
    <div className="flex w-full items-center justify-center flex-col gap-2">
      <pre className="text-base sm:text-2xl">
      {`
    :::      :::::::      :::     
   :+:      :+:   :+:    :+:      
  +:+ +:+   +:+  :+:+   +:+ +:+   
 +#+  +:+   +#+ + +:+  +#+  +:+   
+#+#+#+#+#+ +#+#  +#+ +#+#+#+#+#+ 
      #+#   #+#   #+#       #+#   
      ###    #######        ###   
      `}
    </pre>

      <h2 className="mt-5 text-3xl">Страница не найдена</h2>
      <Link to="/" className="text-[16px]">
        Домой
      </Link>
    </div>
  );
};

export default NotFound;
