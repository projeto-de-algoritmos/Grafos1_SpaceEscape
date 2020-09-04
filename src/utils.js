function cast_ray_into_tilemap(x0, y0, x1, y1, layer) {
	ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	return layer.getTilesWithinShape(ray, {isNotEmpty: true})
}

class Graph {
	constructor() {
		this.vertices = 0;
		this.adjList = new Map();
	}
	
	addVertex(v) {
		this.adjList.set(v, []);
	}
	
	addEdge(v1, v2) {
		this.adjList.get(v1).push(v2);
		this.adjList.get(v2).push(v1);
	}
}