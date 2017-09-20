import { discounted, isEmpty } from '../helperFunctions';

// Graph is the class that will handle creating a matrix of vertices (cities) and using
// a Dijsktra's shortest path algorithm to determine shortest path between two vertices
// based on a type of search (fastest, cheapest)
class Graph {
    /*
        In my constructor i create an adjacency matrix basically with the purpose
        to output an object that i can use in the Dijkstra's algorithm with ease
        the desired output format would be like this:
        {
            city: 
                adjacentCity: {
                    transport: {
                        transportType: distance,
                        transporttype2: distance,
                        etc...
                    }
                }          
        } 
    */
    constructor(input) {
        let vertices = {};

        for (let i = 0; i < input.length; i++) {
            let deal = input[i];

            let distanceObj = {
                'cost': discounted(deal.cost, deal.discount),
                'duration': parseInt(deal.duration.h * 60) + parseInt(deal.duration.m),
                'reference': deal.reference
            };

            // {transport: cost}
            // example: {bus: 40}
            let weightObj = {};
            weightObj[deal.transport] = distanceObj;

            // {arrivalCity: {transport: cost}}
            // example: {amsterdam: {car: 50}}
            let edgeObj = {};
            edgeObj[deal.arrival] = weightObj;

            if (deal.departure in vertices) {
                // if object already defined, add another weight obj
                if (!(deal.arrival in vertices[deal.departure])) {
                    vertices[deal.departure][deal.arrival] = weightObj;
                } else {
                    vertices[deal.departure][deal.arrival][deal.transport] = distanceObj;
                }
            } else {
                // else, set {departureCity: {arrivalCity: {transport: cost}}}
                // example: {London: {Amsterdam: {car: 50}}}
                vertices[deal.departure] = edgeObj;
            }
        }

        for (let i = 0; i < input.length; i++) {
            let deal = input[i];

            if (!(deal.arrival in vertices)) {
                vertices[deal.arrival] = {};
            }
        }

        this.vertices = vertices || {};
    }

    // Lengths or weights, basically the distance unit between two vertices
    // based on a certain field (type), could be cost or duration for our project
    verticesLength(u, v, type) {
        let vertex = this.vertices[u][v];

        if (vertex) {
            let lengths = {};

            for (let prop in vertex) {
                if (type == 'cost')
                    lengths[prop] = vertex[prop].cost;
                else if (type == 'duration')
                    lengths[prop] = vertex[prop].duration;
            }

            // {transport: cost, transport: cost, ....}
            return lengths;
        }
    }

    // Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph
    // https://en.wikipedia.org/wiki/Dijkstra's_algorithm#Algorithm
    // We will implement it and tweak it to our needs
    // I will refer to the psuedo code in my comments in this function
    Dijkstra(source, target, type) {
        // create vertex set Q
        let Q = {},
            dist = {},
            prev = {},
            u;

        /**
         * for each vertex v in Graph:             // Initialization
         *     dist[v] ← INFINITY                  // Unknown distance from source to v
         *     prev[v] ← UNDEFINED                 // Previous node in optimal path from source
         *     add v to Q                          // All nodes initially in Q (unvisited nodes)
         */
        for (let vertex in this.vertices) {
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
        while (!isEmpty(Q)) {
            // u ← vertex in Q with min dist[u]    // Node with the least distance will be selected first
            u = this.extractMin(Q, dist);

            // remove u from Q
            delete Q[u];

            // Terminate the search when shortest path between source and target is found
            if (u == target) {
                break;
            }

            // for each neighbor v of u:           // where v (neighbor) is still in Q.
            for (let neighbor in this.vertices[u]) {
                // alt ← dist[u] + length(u, v)
                let tripsDistances = this.verticesLength(u, neighbor, type);

                for (let trip in tripsDistances) {
                    let alt = dist[u].distance + tripsDistances[trip];

                    // A shorter path to v (neighbor) has been found
                    if (alt < dist[neighbor].distance) {
                        let reference = this.vertices[u][neighbor][trip].reference;
                        dist[neighbor].distance = alt;
                        dist[neighbor].reference = reference;
                        prev[neighbor].vertex = u;
                        prev[neighbor].reference = reference;
                    }
                }
            }
        }


        // Construct the shortest path with a stack S
        let S = [];
        u = target;
        while (prev[u].vertex) {
            S.push(prev[u].reference); // Push the vertex onto the stack
            u = prev[u].vertex; // Traverse from target to source
        }

        // Reverse to have the order from source to target
        if (S.length > 0) {
            S.reverse();
        }

        return S;
    }

    // Retrieve the full trip object using the outputted trips result set
    // The returned array is what will be eventually printed
    getPathVertices(input, data) {
        let results = [];

        for (let obj in input) {
            let reference = input[obj];

            // Filter the deals using the unique reference number
            let filterResult = data.filter(function(obj) {
                return obj.reference == reference;
            });

            results.push(filterResult[0]);
        }

        return results;
    }

    // A function to get the cheapest trip from dijkstra's function
    // in the final format which contains all the trip's data
    cheapestTrip(source, target, data) {
        let trips = this.Dijkstra(source, target, 'cost');

        return this.getPathVertices(trips, data);
    }

    // A function to get the fastest trip from dijkstra's function
    // in the final format which contains all the trip's data
    quickestTrip(source, target, data) {
        let trips = this.Dijkstra(source, target, 'duration');

        return this.getPathVertices(trips, data);
    }

    // Extract the node with minimum distance from active vertex.
    extractMin(Q, dist) {
        let minimumDistance = Infinity;
        let nodeWithMinimumDistance;

        for (let node in Q) {
            if (dist[node].distance <= minimumDistance) {
                minimumDistance = dist[node].distance;
                nodeWithMinimumDistance = node;
            }
        }
        return nodeWithMinimumDistance;
    }
}

module.exports = Graph;
