import React from 'react';
var RadarChart = require("react-chartjs").Radar;


export default class CurrencyChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            chartData: this.props.data,
            chartOptions: this.props.options
        }
    }

    _onChange(){
        this.setState()
    }

    render() {
        return (
            <div className = "currencyChart">
                <RadarChart data={this.state.chartData} options={this.state.chartOptions} width="600" height="600" redraw/>
            </div>
        );
    }
};
