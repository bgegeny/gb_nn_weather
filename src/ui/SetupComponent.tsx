import {useAppDispatch, useAppSelector} from '../api/hooks/redux-hooks';
import { darkModeSlice } from '../api/redux/dark-mode-slice';
import { unitsSlice } from '../api/redux/units-slice';
import { units } from '../api/constants/widget-constants';
import { isMetric } from '../api/helpers/unit-helpers';

const SetupComponent = () => {

    const darkMode = useAppSelector(state => state.darkMode.value);
    const unit = useAppSelector(state => state.units.value);

    const dispatch = useAppDispatch();

    return (
        <div
            className="component setup-component"
        >
            <div
                className="layout-selector"
            >
                <div
                    className="text-center"
                >
                    Theme
                </div>
                <button
                    className="btn btn-warning"
                    onClick={()=>{
                        dispatch(darkModeSlice.actions.toggle());
                    }}
                >
                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                </button>
            </div>
            <div
                className="metric-selector"
            >
                <div
                    className="text-center"
                >
                    Unit
                </div>
                <button
                    className="btn btn-warning"
                    onClick={()=>{
                        dispatch(unitsSlice.actions.toggle());
                    }}
                >
                    {isMetric(unit) ? units.METRIC : units.IMPERIAL}
                </button>
            </div>
        </div>
    );
}

export default SetupComponent;
