import WeatherItemMain from "../API/weatherItemMain";
import SearchUser from "./searchUser";
import "../styles/header.css";

function Header() {
    return <div className="container-header">       
        <WeatherItemMain/>
        <SearchUser/>
    </div>
}

export default Header;