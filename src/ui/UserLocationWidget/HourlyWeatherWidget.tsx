import { useAppSelector } from '../../api/hooks/redux-hooks';
import { isMetric } from '../../api/helpers/unit-helpers';
import { sInMs } from '../../api/constants/time-constants';

const HourlyWeatherWidget = (props: {
    forecast: Array<{ dt: number, temp: number }>
}) => {

    const { forecast } = props;
    const unit = useAppSelector(state => state.units.value);
    const darkMode = useAppSelector(state => state.darkMode.value);

    return (
        <>
            <div
                className="text-center pb-3 pt-3 border-bottom"
            >
                Hourly forecast
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
                                    {forecast.map(({ dt }, i) => <th key={i}><div>{new Date(dt*sInMs).getHours()}:00</div></th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {forecast.map(({ temp }, i) => <td key={i}><div>{`${temp} ${isMetric(unit) ? '°C' : '°F'}`}</div></td>)}
                                </tr>
                            </tbody>
                        </table> : undefined
                    }

            </div>
        </>

    );
}

export default HourlyWeatherWidget;
