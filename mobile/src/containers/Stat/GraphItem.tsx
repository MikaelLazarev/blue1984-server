import {Graph} from "../../core/stat";
import {Text} from "react-native-elements";
import {LineChart} from "react-native-chart-kit";
import {Dimensions, View} from "react-native";
import React from "react";
import Loading from "../../components/Loading";

export interface GraphItemProps {
    name: string;
    data: Graph
}

export const GraphItem : React.FC<GraphItemProps> = ({name, data}) => {

    if (data === undefined || data.x.length === 0) return <View style={{marginTop: '3%', marginBottom: '3%'}}>
        <View style={{alignItems: 'center'}}>
            <Text h2 >{name}</Text>
            <Text h3 >No data yet.</Text>
        </View>
    </View>

    return <View>
        <View style={{alignItems: 'center'}}>
        <Text h2 >{name}</Text>
        </View>
        <LineChart
            data={{
                labels: data.x.map((i, x)=> x.toString()),
                datasets: [
                    {
                        data: data.y.map(y => Math.floor(y))
                    }
                ]
            }}
            width={Dimensions.get("window").width*0.9} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=" ms"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "#1a5588",
                backgroundGradientFrom: "#1a5588",
                backgroundGradientTo: "#1a5588",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 0
                },
                propsForDots: {
                    r: "2",
                    strokeWidth: "1",
                    stroke: "#ffffff"
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}
        />
    </View>
}
