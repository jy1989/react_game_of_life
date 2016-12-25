import React from 'react';
import ReactDOM from 'react-dom';
//import Perf from 'react-addons-perf' // ES6
class Cell extends React.Component {
    constructor(props) {
        super(props);
		let cellName=this.props.name;
		let w=this.props.size;
		let h=this.props.size;
        let x=parseInt(cellName.split('_')[0])*w;
		let y=parseInt(cellName.split('_')[1])*h;
		
		this.style={left:x,top:y,width:w,height:h};
    }/*
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.alive !== this.props.alive;
    }*/

    render() {
        //let className = ['cell'];
		
		
        //if (this.props.alive) {
            //className.push('alive');
        //}

        return (
            <div style={this.style} className={'cell alive'}></div>
        );
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
		this.state={cellSize:2,w:200,h:200,chance:0.5,stopTime:5000,timeLoop:500,run:true}
		
    }
	changeRunState(){
		//e.stopPropagation();
		
		this.setState({run:!this.state.run});
		
	}
    render() {
		return ( <div>
			
			<CellBoard {...this.state} />
			<button onClick={this.changeRunState.bind(this)}>{this.state.run?'停止':'运行'}</button>
		</div>
		)
	}
}



class CellBoard extends React.Component {
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
		this.run=true;
        //per_width = per_width < 5 ? 10 : per_width;
        for (let i = 0; i < parseInt(this.props.h / this.props.cellSize); i++) {
            for (let j = 0; j < parseInt(this.props.w / this.props.cellSize); j++) {
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
				this.state[i + '_' + j] = (Math.random() > this.props.chance);
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
		if(!this.props.run){
			return;
		}
		
        if (this.runTime >= this.props.stopTime) {
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
        this.timer = setInterval(this.tick, this.props.timeLoop);

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {

        return (
            <div>
				<div id="show">
					{
						Object.keys(this.state).map((k, index) =>{ 
							if(this.state[k]){
								return <Cell size={this.props.cellSize} key={k} name={k} />
							}
						}) 
					}
				</div>
				<div className="detail">
					<div>细胞数:{this.cellsCount}</div>
				    <div>剩余进化次数:{(this.props.stopTime-this.runTime)}</div>
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