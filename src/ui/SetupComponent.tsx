import { useAppDispatch } from '../api/hooks/redux-hooks';
import { darkModeSlice } from '../api/redux/dark-mode-slice';
import {units} from '../api/constants/open-weather-constants';
import {unitsSlice} from '../api/redux/units-slice';

const SetupComponent = (props: {
    darkMode: boolean,
    unit: string,
}) => {

    const { darkMode, unit } = props;

    const dispatch = useAppDispatch();

    return (
        <div
            className='component setup-component'
        >
            <div
                className='layout-selector'
            >
                <div
                    className="text-center"
                >
                    Page Layout
                </div>
                <button
                    className='btn btn-warning'
                    onClick={()=>{
                        dispatch(darkModeSlice.actions.toggle());
                    }}
                >
                    {darkMode ? "Dark Mode" : "Light Mode"}
                </button>
            </div>
            <div
                className='metric-selector'
            >
                <div
                    className="text-center"
                >
                    Unit
                </div>
                <button
                    className='btn btn-warning'
                    onClick={()=>{
                        dispatch(unitsSlice.actions.toggle());
                    }}
                >
                    {unit === units.METRIC ? units.METRIC : units.IMPERIAL}
                </button>
            </div>
        </div>
    );
}

export default SetupComponent;
