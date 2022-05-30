import React from "react";

import ScrollContainer from '../../components/scrollContainer/ScrollContainer'

import './App.scss';


interface props {}
interface state {items: Array<any>}

export default class App extends React.Component<props, state> {
    constructor(p: any) {
        super(p);
        
        this.state = {items: []}
        fetch('/static/metadata.json').then((response) => response.json().then(jsn => this.setState({items: jsn['items']})))
    }


    render() {
        return [
            <div className='header'>

            </div>,
        
            <ScrollContainer items={this.state.items} />
        ]
    }
}
