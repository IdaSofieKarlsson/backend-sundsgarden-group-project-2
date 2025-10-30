import WeatherItemMain from "../API/weatherItemMain";

function Header() {
    return <div>
        <p>This is the header. It should be horisontal, unlike the vertical, to the left, navbar. <br />
        The header contains the weather API. So linking in the weather api component here. </p>
        <WeatherItemMain/>
    </div>
}

export default Header;