import React from 'react';
import ReactDOM from 'react-dom';
class Cell extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.alive !== this.props.alive;
    }

    render() {
        let className = ['life'];
        if (this.props.alive) {
            className.push('alive');
        }

        return (
            <div className={className.join(' ')}></div>
        );
    }
}

let lifeSize = 5;
let w = 100;
let h = 100;
let chance = 0.75;
let stopTime = 999;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        //this.cellsDiv=[];
        //console.log(store);
        this.checkAlive = this.checkAlive.bind(this);
        this.tick = this.tick.bind(this);
        this.runTime = 1;


        //per_width = per_width < 5 ? 10 : per_width;
        for (let i = 0; i < parseInt(h / lifeSize); i++) {
            for (let j = 0; j < parseInt(w / lifeSize); j++) {
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
            }
        }



    }
    checkAlive(cellName) {

        //console.log(neighborCells);
        let o = this.state[cellName];
        //console.log(i,j);
        let neighborCells = o['neighbor'];

        let alivecount = 0;
        for (let cell in neighborCells) {
            //console.log(neighborCells[cell],this.state[neighborCells[cell]]);
            if (this.state[neighborCells[cell]]) {
                if (this.state[neighborCells[cell]]['alive']) {
                    alivecount++;
                }
            }
        }
        //let alive = this.state[i + '_' + j]['alive'];
        //console.log(alive,alivecount);
        if (o['alive']) {
            if (alivecount < 2 || alivecount > 3) {
                o['alive'] = false;
            }
        } else {
            if (alivecount == 3) {
                o['alive'] = true;
            }
        }
        //console.log(o);
        let cells = {};
        cells[cellName] = {};
        cells[cellName]['alive'] = o['alive'];
        cells[cellName]['neighbor'] = o['neighbor'];
        this.setState(cells);
    }


    tick() {
        //console.log(this.runTime,stopTime);
        if (this.runTime >= stopTime) {
            clearInterval(this.timer);
        }
        
        //console.log(this.state);
        for (let cellName in this.state) {
            this.checkAlive(cellName);
        }

		this.runTime++;
        //console.log(this.state);
        //this.setState({alive:alive});
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
    
        return (
            <div id="show">
            { Object.keys(this.state).map((k, index) => <Cell key={k} alive={this.state[k]['alive']}/>) }
			
			</div>
        );

    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);