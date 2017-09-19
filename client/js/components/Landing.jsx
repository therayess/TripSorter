import React from 'react';
import data from '../response';

var Graph = function(input) {
        var vertices = {};

        for (var i = 0; i < input.length; i++) {
            var deal = input[i];

            var distanceObj = {
                'cost': deal.cost - deal.discount,
                'duration': parseInt(deal.duration.h * 60) + parseInt(deal.duration.m),
                'reference': deal.reference
            };

            // {transport: cost}
            // example: {bus: 40}
            var lengthObj = {};
            lengthObj[deal.transport] = distanceObj;

            // {arrivalCity: {transport: cost}}
            // example: {amsterdam: {car: 50}}
            var edgeObj = {};
            edgeObj[deal.arrival] = lengthObj;

            if (deal.departure in vertices) {
                // if object already defined, add another length obj
                vertices[deal.departure][deal.arrival][deal.transport] = distanceObj;
            } else {
                // else, set {departureCity: {arrivalCity: {transport: cost}}}
                // example: {London: {Amsterdam: {car: 50}}}
                vertices[deal.departure] = edgeObj;
            }
        }

        for (var i = 0; i < input.length; i++) {
            var deal = input[i];

            if (!(deal.arrival in vertices)) {
                vertices[deal.arrival] = {};
            }
        }

        this.vertices = vertices || {};
    };

    Graph.prototype.length = function(u, v, type) {
        var vertex = this.vertices[u][v];

        if (vertex) {
            var lengths = {};

            for (var prop in vertex) {
                if (type == 'cost')
                    lengths[prop] = vertex[prop].cost;
                else if (type == 'duration')
                    lengths[prop] = vertex[prop].duration;
            }

            // {transport: cost, transport: cost, ....}
            return lengths;
        }
    };

    Graph.prototype.cheapestTrip = function(source, target) {
        return this.Dijkstra(source, target, 'cost');
    }

    Graph.prototype.quickestTrip = function(source, target) {
        return this.Dijkstra(source, target, 'duration');
    }

    /**
     * Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph
     * @param source
     * @returns {{}}
     */
    Graph.prototype.Dijkstra = function(source, target, type) {
        // create vertex set Q
        var Q = {},
            dist = {},
            prev = {};

        /**
         * for each vertex v in Graph:             // Initialization
         *     dist[v] ← INFINITY                  // Unknown distance from source to v
         *     prev[v] ← UNDEFINED                 // Previous node in optimal path from source
         *     add v to Q                          // All nodes initially in Q (unvisited nodes)
         */
        for (var vertex in this.vertices) {
            dist[vertex] = {
                'distance': Infinity,
                'reference': ''
            };
            prev[vertex] = {
                'vertex': undefined,
                'reference': ''
            };
            Q[vertex] = this.vertices[vertex];
        }

        // dist[source] ← 0  // Distance from source to source

        dist[source].distance = 0;

        // while Q is not empty:
        while (!_isEmpty(Q)) {
            // u ← vertex in Q with min dist[u]    // Source node will be selected first
            var u = _extractMin(Q, dist);

            // remove u from Q
            delete Q[u];

            if (u == target) {
                break;
            }

            // for each neighbor v of u:           // where v is still in Q.
            for (var neighbor in this.vertices[u]) {
                // alt ← dist[u] + length(u, v)
                var tripsDistances = this.length(u, neighbor, type);

                for (trip in tripsDistances) {
                    var alt = dist[u].distance + tripsDistances[trip];

                    if (alt < dist[neighbor].distance) {
                        var reference = this.vertices[u][neighbor][trip].reference;
                        dist[neighbor].distance = alt;
                        dist[neighbor].reference = reference;
                        prev[neighbor].vertex = u;
                        prev[neighbor].reference = reference;
                    }
                }
            }
        }

        var S = [];
        u = target;
        while (prev[u].vertex) {
            S.push(prev[u].reference);
            u = prev[u].vertex;
        }

        if (S.length > 0) {
            S.reverse();
        }

        return S;
    };

    /**
     * Just a utility method to check if an Object is empty or not
     * @param obj
     * @returns {boolean}
     * @private
     */
    function _isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    /**
     * Extract the node with minimum distance from active vertex.
     * This should not be required if using a priority queue
     * @param Q
     * @param dist
     * @returns {*}
     * @private
     */
    function _extractMin(Q, dist) {
        var minimumDistance = Infinity;
        var nodeWithMinimumDistance;

        for (var node in Q) {
            if (dist[node].distance <= minimumDistance) {
                minimumDistance = dist[node].distance;
                nodeWithMinimumDistance = node;
            }
        }
        return nodeWithMinimumDistance;
    }

class Landing extends React.Component {
    constructor(props) {
        super(props);

        const deals = data.deals;

        this.state = {
            deals: deals,
            departureCities: [...new Set(deals.map(deal => deal.departure))],
            arrivalCities: [...new Set(deals.map(deal => deal.arrival))],
            departure: deals[0].departure,
            arrival: deals[0].arrival,
            type: '',
            results: []
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }
    handleFieldChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
    handleFormSubmit(event) {
        event.preventDefault();

        var G = new Graph(this.state.deals);
        var trips = G.cheapestTrip(this.state.departure, this.state.arrival);
    }
	render() {
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
                                    <input type="radio" name="type" id="cheapest" value="cheapest" onChange={this.handleFieldChange} /> Cheapest
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="type" id="fastest" value="fastest" onChange={this.handleFieldChange} /> Fastest
                                </label>
                            </div>
                        </div>
                        <div className="col-xs-3">
                            <input type="submit" value="Search" />
                        </div>
                    </div>
                </form>

                {this.state.results.length > 0 ? 
                    <div id="results">
                        <h3>We found the following trip route for you:</h3>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="result-row clearfix">
                                    <div className="pull-left">
                                        <p>London > Paris</p>
                                        <p className="transport">Train: AB2510 for 02h 15m</p>
                                    </div>
                                    <div className="pull-right">
                                        <p>100 EUR</p>
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
