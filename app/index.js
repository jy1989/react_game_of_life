import React from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group} from 'react-konva';
class Cell extends React.Component {
    constructor(props) {
        super(props);
    }
	/*
    shouldComponentUpdate(nextProps, nextState) {
        //return nextProps.alive !== this.props.alive;
    }*/

    render() {
		let cellName=this.props.name;
		let w=cellSize;
		let h=cellSize;
        let x =parseInt(cellName.split('_')[0])*w;
		let y=parseInt(cellName.split('_')[1])*h;
		
		//let color=(this.props.alive)?'red':'black';

        return (
            <Rect x={x} y={y} width={w} height={h}
                fill={'black'} />
        );
    }
}

let cellSize = 4;
let w = 400;
let h = 400;
let chance = 0.5;
let stopTime = 5000;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
		this.cellsNeighbor={};
        //this.cellsDiv=[];
        //console.log(store);
        this.checkAlive = this.checkAlive.bind(this);
        this.tick = this.tick.bind(this);
        this.runTime = 1;
        this.aliveCount = 0;
        this.deadCount = 0;
        this.cellsCount = 0;
        //per_width = per_width < 5 ? 10 : per_width;
        for (let i = 0; i < parseInt(h / cellSize); i++) {
            for (let j = 0; j < parseInt(w / cellSize); j++) {
                let neighborCells = [];
                neighborCells.push((i - 1) + '_' + (j - 1));
                neighborCells.push((i - 1) + '_' + (j + 1));
                neighborCells.push((i + 1) + '_' + (j - 1));
                neighborCells.push((i + 1) + '_' + (j + 1));
                neighborCells.push(i + '_' + (j - 1));
                neighborCells.push(i + '_' + (j + 1));
                neighborCells.push((i + 1) + '_' + j);
                neighborCells.push((i - 1) + '_' + j);
				/*
                this.state[i + '_' + j] = {};
                this.state[i + '_' + j]['alive'] = (Math.random() > chance);
                this.state[i + '_' + j]['neighbor'] = neighborCells;
                */
				this.state[i + '_' + j] = (Math.random() > chance);
				this.cellsNeighbor[i + '_' + j] = neighborCells;
				this.cellsCount++;
            }
        }
        //console.log(k);



    }
    checkAlive(cells, cellName) {

        //console.log(neighborCells);
        let alive = this.state[cellName];
        //console.log(i,j);
        let neighborCells= this.cellsNeighbor[cellName];

        let neighborAliveCount = 0;
        for (let cell in neighborCells) {
            //console.log(neighborCells[cell],this.state[neighborCells[cell]]);
            if (this.state[neighborCells[cell]]) {
                if (this.state[neighborCells[cell]]) {
                    neighborAliveCount++;
                }
            }
        }
        //let alive = this.state[i + '_' + j]['alive'];
        //console.log(alive,alivecount);
        if (alive) {
            if (neighborAliveCount < 2 || neighborAliveCount > 3) {
                alive = false;
            }
        } else {
            if (neighborAliveCount == 3) {
                alive = true;
            }
        }
        //console.log(o);
        //let cells = {};
        cells[cellName] = alive;

        return cells;


        /*
        Perf.start();
         this.setState(cells);
        Perf.stop();
        Perf.printInclusive();
        Perf.printWasted();
        */
    }


    tick() {
        //console.log(this.runTime,stopTime);
        if (this.runTime >= stopTime) {
            clearInterval(this.timer);
        }

        //console.log(this.state);
        let newState = {};
        this.aliveCount = 0;
        this.deadCount = 0;
        for (let cellName in this.state) {
            newState = this.checkAlive(newState, cellName);
            if (this.state[cellName]) {
                this.aliveCount++;
            } else {
                this.deadCount++;
            }
            //this.checkAlive(cellName);
        }
        this.setState(newState);
        this.runTime++;
        //console.log(this.state);
        //this.setState({alive:alive});
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 500);

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {

        return (
            <div>
				<Stage width={w} height={h}>
					<Layer hitGraphEnabled={false}>
					{
						Object.keys(this.state).map((k, index) =>{ 
							if(this.state[k]){
								return <Cell key={k} name={k} />
							}
						}) 
					}
					</Layer>
				</Stage>
				<div className="detail">
					<div>细胞数:{this.cellsCount}</div>
				    <div>剩余进化次数:{(stopTime-this.runTime)}</div>
				    <div>存活细胞数量:{this.aliveCount}</div>
				    <div>死亡细胞数量:{this.deadCount}</div>
				</div>
			</div>
        );

    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);