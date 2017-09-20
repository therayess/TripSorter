import React from 'react';
import Graph from '../containers/Graph';
import { discounted } from '../helperFunctions';
import data from '../response';

class Landing extends React.Component {
    constructor(props) {
        super(props);

        const deals = data.deals;
        const currency = data.currency;

        this.state = {
            currency: currency,
            deals: deals,
            departureCities: [...new Set(deals.map(deal => deal.departure))],
            arrivalCities: [...new Set(deals.map(deal => deal.arrival))],
            departure: deals[0].departure,
            arrival: deals[0].arrival,
            type: 'cheapest',
            trips: [],
            totalDuration: {h: 0, m: 0},
            totalCost: 0
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }
    handleFieldChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    handleFormSubmit(event) {
        event.preventDefault();

        let trips,
            tripsGraph = new Graph(this.state.deals);

        if (this.state.type == 'cheapest') {
            trips = tripsGraph.cheapestTrip(this.state.departure, this.state.arrival, this.state.deals);
        } else if (this.state.type == 'fastest') {
            trips = tripsGraph.quickestTrip(this.state.departure, this.state.arrival, this.state.deals);
        }

        this.calculateTotals(trips);

        this.setState({trips: trips});
    }
    calculateTotals(trips) {
        let totalHours = 0,
            totalMinutes = 0,
            totalCost = 0;

        for (let index in trips) {
            let trip = trips[index];

            totalHours += parseInt(trip.duration.h);
            totalMinutes += parseInt(trip.duration.m);
            totalCost += discounted(trip.cost, trip.discount);
        }

        this.setState({totalDuration: {h: totalHours, m: totalMinutes}, totalCost: totalCost});
    }
	render() {
        const self = this;
		return (
			<section id="landing" className="container">
				<form id="trip-form" onSubmit={this.handleFormSubmit}>
                    <div className="row">
                        <div className="col-xs-3">
                            <div className="form-group">
                                <label>From</label>
                                <select name="departure" 
                                        value={this.state.departure} 
                                        className="form-control" 
                                        onChange={this.handleFieldChange}>
                                    {this.state.departureCities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <div className="form-group">
                                <label>To</label>
                                <select name="arrival" 
                                        value={this.state.arrival} 
                                        className="form-control" 
                                        onChange={this.handleFieldChange}>
                                    {this.state.arrivalCities.map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <label>Search Type</label>
                            <div>
                                <label className="radio-inline">
                                    <input type="radio" name="type" id="cheapest" value="cheapest" checked={this.state.type === 'cheapest'} onChange={this.handleFieldChange} /> Cheapest
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="type" id="fastest" value="fastest" checked={this.state.type === 'fastest'} onChange={this.handleFieldChange} /> Fastest
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <input type="submit" value="Search" />
                        </div>
                    </div>
                </form>

                {this.state.trips.length > 0 ? 
                    <div id="results">
                        <h3>We found the following trip route for you:</h3>
                        <div className="row">
                            <div className="col-xs-7">
                                {this.state.trips.map((trip, index) => (
                                    <div key={index} className="result-row clearfix">
                                        <div className="pull-left">
                                            <p>{trip.departure} > {trip.arrival}</p>
                                            <p className="transport">
                                                <span className="type">{trip.transport}</span>: {trip.reference} for {trip.duration.h}h {trip.duration.m}m
                                            </p>
                                        </div>
                                        <div className="pull-right">
                                            <p>{discounted(trip.cost, trip.discount)} {self.state.currency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-xs-5">
                                <div className="totals">
                                    <div className="row">
                                        <div className="col-xs-4"><strong>Total:</strong></div>
                                        <div className="col-xs-4">{self.state.totalDuration.h}h {self.state.totalDuration.m}m</div>
                                        <div className="col-xs-4">{self.state.totalCost} {self.state.currency}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                : ''}
			</section>
		)
	}
}

module.exports = Landing;
