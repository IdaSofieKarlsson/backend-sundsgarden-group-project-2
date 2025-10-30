import WeatherItemMain from "../API/weatherItemMain";
import SearchUser from "./searchUser";

function Header() {
    return <div className="container-header">       
        <WeatherItemMain/>
        <SearchUser/>
    </div>
}

export default Header;