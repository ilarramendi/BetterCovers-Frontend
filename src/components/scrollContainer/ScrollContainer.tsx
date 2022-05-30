
import React from "react";
import './ScrollContainer.scss';

interface props {items: Array<any>}
interface state {position: number, isDragging: boolean, startPosition: number, startMousePosition: number}

import ImageSelector from '../../components/imageSelector/ImageSelector'

export default class ScrollContainer extends React.Component<props, state> {
    constructor (p: props) {
        super(p);
        this.state = {position: 0, isDragging: false, startPosition: 0, startMousePosition: 0}
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    onKeyDown(e: any) {
        const round = this.state.position == Math.floor(this.state.position)
        var position = this.state.position
        if (e.key == "ArrowLeft") position =  round ? this.state.position - 1 : Math.floor(this.state.position)
        if (e.key == "ArrowRight") position = round ? this.state.position + 1 : Math.floor(this.state.position + 1)

        if (position >= 0 && position < this.props.items.length - 15) this.setState({position})
    }
    
    
    render() {
        return <div 
            tabIndex={0}
            className={'horizontalContainer'} 
            onMouseDown={(e: any) => this.setState({isDragging: true, startPosition: this.state.position, startMousePosition: e.clientX})}
            onMouseMove={(e: any) => {if (this.state.isDragging) this.setState({position: Math.min(this.props.items.length - 15, Math.max(0, this.state.startPosition + (this.state.startMousePosition - e.clientX) * 0.004))})}}
            onMouseUp={() => this.setState({isDragging: false})}
            onKeyDown={this.onKeyDown}>
                {this.props.items.slice(this.state.position, this.state.position + 15).map((item, i) => <ImageSelector key={this.state.position + i} selected={i == Math.round(window.innerWidth / 210 / 2)} images={item.images['covers']} folder={item.folder} />)}
        </div>
    }
}