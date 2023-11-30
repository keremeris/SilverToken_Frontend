import { Info } from "../info/Info"

export function FilterBtn({ text, activeFilter, onFilter }) {
  const handleClick = (val)=> {  
    onFilter(val);
  };
  return (
    <div className="flex">
      <li
        className={`${
          activeFilter === text ? 'text-textPrimary' : 'text-textSecondary'
        } font-mainSemibold text-xl hover:text-textPrimary capitalize transition-all`}
        role="button"
        onClick={()=> handleClick(text)}
      >
        {text}
      </li>
      {text === "bridge" ? (
        <Info 
          type="info"
          text="This is where you can swap SilverTokens (SLVT) from the Ethereum network to the Polygon network and vice versa"
          classname="w-[12px] h-[12px]"
        />
      ) : (
        ""
      )}
    </div>
    
  );
}
