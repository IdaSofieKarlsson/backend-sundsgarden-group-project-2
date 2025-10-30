import type { WeatherItemType } from "../interfaces/weatherType";

function WeatherItemDetail(props: WeatherItemType) {
  //variables as a base for gathering data into the WeatherItems
  //(we'll probably need multiple so I guess this will be an array in the end)
  //Regardless I'd make imports in some way

  const weatherDetails: WeatherItemType = {
    icon: "fa-solid fa-temperature-full",
    titel: "Feels like",
    info: "-1°C",
    color: "#c76000ff",
  };

  return (
    <div className="weather__details-item">
      <i className={props.icon} style={{ color: props.color }}></i>
      <div>
        <p>{props.titel}</p>
        <h6>{props.info}</h6>
      </div>
    </div>
  );
}

export default WeatherItemDetail;
