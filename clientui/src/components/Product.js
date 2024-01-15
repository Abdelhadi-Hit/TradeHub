import React from "react";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <Link to={`/products/${product?.id}`}>
      <div className="flex flex-col justify-start items-center gap-4 w-full max-w-[350px]">
        <img
          style={{ height: "200px", width: "auto" }}
          src={product?.image}
          alt={product?.name}
        />
        
        <h3 className="text-blue-500 underline">{product?.title}</h3>
      </div>
    </Link>
  );
}

export default Product;
