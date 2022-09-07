import {useAppSelector} from "../../api/hooks/redux-hooks";
import {units} from "../../api/constants/open-weather-constants";

const DailyWeatherWidget = (props: {
    forecast: Array<{ dt: number, temp: { day: number, night: number } }>
}) => {

    const { forecast } = props;
    const unit = useAppSelector(state => state.units.value);
    const darkMode = useAppSelector(state => state.darkMode.value);

    return (
        <>
            <div
                className="text-center pt-3 pb-3 border-bottom"
            >
                <span className="m-2">6-Day forecast</span>
                <img alt="day-night" id="day-night-img" src="./day_and_night.png" />
            </div>
            <div
                className="table-responsive"
            >
                {forecast ?
                    <table
                        className={`table ${darkMode ? 'table-dark' : ''}`}
                    >
                        <thead>
                        <tr>
                            {forecast.map(({ dt }, i) => <th key={i}>{new Date(dt*1000).toDateString()}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            {forecast.map(({ temp }, i) => <td key={i}>{`${temp.day}/${temp.night} ${unit === units.METRIC ? '°C' : '°F'}`}</td>)}
                        </tr>
                        </tbody>
                    </table> : undefined
                }

            </div>
        </>

    );
}

export default DailyWeatherWidget;
