import React, {useRef, useState} from "react";
import View3D from "../View3D";
import Slider from "rc-slider";


export default () => {
    const [options, setOptions] = useState({strength: 0.4, threshold: 0.5, radius: 0.5});
    const view3D = useRef<View3D>(null);

    return <>
        <section>
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td className="mr-2">threshold:</td>
                        <td>
                            <Slider
                                step={0.01}
                                min={0}
                                max={1}
                                defaultValue={options.strength}
                                onChange={val => {
                                    const newThreshold = val as number;
                                    const newVal = {...options, threshold: newThreshold};
                                    setOptions(newVal);
                                    view3D.current!.view3D.bloom = newVal;
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="mr-4" style={{width: '150px'}}>Strength: {options.strength}</td>
                        <td style={{width: '100px'}}>
                            <Slider
                                step={0.01}
                                min={0}
                                max={3}
                                defaultValue={options.strength}
                                onChange={val => {
                                    const newStrength = val as number;
                                    const newVal = {...options, strength: newStrength};
                                    setOptions(newVal);
                                    view3D.current!.view3D.bloom = newVal;
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="mr-2">radius:</td>
                        <td>
                            <Slider
                                step={0.01}
                                min={0}
                                max={3}
                                defaultValue={options.radius}
                                onChange={val => {
                                    const newRadius = val as number;
                                    const newVal = {...options, radius: newRadius};
                                    setOptions(newVal);
                                    view3D.current!.view3D.bloom = newVal;
                                }}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <View3D
                ref={view3D}
                src="/egjs-view3d/model/draco/alarm.glb"
                bloom={options}
                showExampleCode
            />
        </section>
    </>;
};
