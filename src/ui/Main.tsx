import '../styles/common.scss'
import UserLocationWidget from "./UserLocationWidget/UserLocationWidget";
import CitiesWidget from "./CitiesWidget/CitiesWidget";
import SetupComponent from "./SetupComponent";

const Main = () => {



    return (
        <>
            <div
                className="main"
            >
                <SetupComponent />
                <UserLocationWidget />
                <CitiesWidget />
            </div>
        </>
    );
}

export default Main;
