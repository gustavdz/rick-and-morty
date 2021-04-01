import React from "react";

const Card = (props) => {
  const { title, data, count, search, regexString, dataString } = props;
  const regex = new RegExp(regexString, "gi"); //manejo de la expresion regular para que tome en cuenta mayuscula y minusculas
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg max-h-96 overflow-scroll overflow-visible">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {title} (total of "{search}": {dataString.replace(regex, "").length})
        </div>
        {/* conteo de caracteres por cada data individual */}
        {data.map((data) => (
          <p key={data.id}>
            {data.name} ({data.name.replace(regex, "").length})
          </p>
        ))}
      </div>
      <div className="px-6 pt-4 pb-2">
        Total {title}:
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {count}
        </span>
      </div>
      <div className="px-6 pt-2 pb-2">
        Total "{search}":
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {/* conteo total de los caracteres */}
          {dataString.replace(regex, "").length}
        </span>
      </div>
    </div>
  );
};

export default Card;
