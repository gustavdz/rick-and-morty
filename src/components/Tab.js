import React from "react";

const Tab = ({ openTab, color, setOpenTab, target, title, tabNumber }) => {
  return (
    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
      <a
        className={
          "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
          (openTab === tabNumber
            ? "text-white bg-" + color + "-600"
            : "text-" + color + "-600 bg-white")
        }
        onClick={(e) => {
          e.preventDefault();
          setOpenTab(tabNumber);
        }}
        data-toggle="tab"
        href={target}
        role="tablist"
      >
        {title}
      </a>
    </li>
  );
};

export default Tab;
