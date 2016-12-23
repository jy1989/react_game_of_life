import React from 'react';
import ReactDOM from 'react-dom';
//import Perf from 'react-addons-perf' // ES6
class Cell extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.alive !== this.props.alive;
    }

    render() {
        let className = ['cell'];
        if (this.props.alive) {
            className.push('alive');
        }

        return (
            <div className={className.join(' ')}></div>
        );
    }
}

let cellSize = 2;
let w = 200;
let h = 200;
let chance = 0.93;
let stopTime = 5000;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                this.state[i + '_' + j] = {};
                this.state[i + '_' + j]['alive'] = (Math.random() > chance);
                this.state[i + '_' + j]['neighbor'] = neighborCells;
                this.cellsCount++;
            }
        }
        //console.log(k);



    }
    checkAlive(cells, cellName) {

        //console.log(neighborCells);
        let o = this.state[cellName];
        //console.log(i,j);
        let neighborCells = o['neighbor'];

        let neighborAliveCount = 0;
        for (let cell in neighborCells) {
            //console.log(neighborCells[cell],this.state[neighborCells[cell]]);
            if (this.state[neighborCells[cell]]) {
                if (this.state[neighborCells[cell]]['alive']) {
                    neighborAliveCount++;
                }
            }
        }
        //let alive = this.state[i + '_' + j]['alive'];
        //console.log(alive,alivecount);
        if (o['alive']) {
            if (neighborAliveCount < 2 || neighborAliveCount > 3) {
                o['alive'] = false;
            }
        } else {
            if (neighborAliveCount == 3) {
                o['alive'] = true;
            }
        }
        //console.log(o);
        //let cells = {};
        cells[cellName] = {};
        cells[cellName]['alive'] = o['alive'];
        cells[cellName]['neighbor'] = o['neighbor'];

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
            if (this.state[cellName]['alive']) {
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
        this.timer = setInterval(this.tick, 100);

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {

        return (
            <div>
				<div id="show">
					{Object.keys(this.state).map((k, index) => <Cell key={k} alive={this.state[k]['alive']}/>) }
				</div>
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