import { useContext, useEffect, useState } from "react";
import { Gyroscope, Accelerometer, DeviceMotion } from 'expo-sensors';
import { stateDispatchContext } from "../redux/context";
import { StyleSheet, Switch } from "react-native";

/*
other available sensors:
https://docs.expo.dev/versions/v48.0.0/sdk/sensors/
accelerometer, pedometer, deviceMotion
*/

export default function Sensors() {
    // gyroscope in degrees/second
    const [subs, setSubs] = useState([null, null]);
    const [enabled, setEnabled] = useState(false);
    const dispatch = useContext(stateDispatchContext);

    const _subscribe = () => {
        const gyroSub = Gyroscope.addListener(gyroscopeData => {
            dispatch({
                type: 'gyro',
                payload: gyroscopeData
            });
        });

        const accelSub = Accelerometer.addListener((data) => {
            dispatch({
                type: 'accelerometer',
                payload: data
            });
        })
        setSubs([gyroSub, accelSub]);
    }

    const _unsubscribe = () => {
        for(let i = subs.length-1; i>=0; i--) {
            subs[i] && subs[i].remove();
        }
        setSubs([null, null]);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    function toggleSwitch() {
        setEnabled(!enabled);
        const period = enabled ? 20 : 1000;
        Gyroscope.setUpdateInterval(period);
        Accelerometer.setUpdateInterval(period);
        dispatch({
            type: 'updatePeriod',
            payload: period
        })
    }

    return (
        <Switch 
            style={styles.switch}
            onValueChange={toggleSwitch}
            value={enabled}
        />
    );
}

const styles = StyleSheet.create({
    switch: {
        position: 'absolute',
        right: 0,
        top: 0,
        marginTop: 10,
        marginRight: 20
    }
})